import {
  CheckboxValue,
  DateValue,
  MultiSelectValue,
  NotionData,
  NotionDataSchema,
  NotionRowsData,
  RelationValue,
  SchemaField,
  TextValue,
  TitleValue,
} from "@/types/notion-raw-data";

import { Block, Collection, CollectionViewBlock, ExtendedRecordMap, PageBlock } from 'notion-types';

// recordMap entries can be double-nested: { role, value: { role, value: T } }.
const unwrap = <T>(wrapper: unknown): T | undefined => {
  if (!wrapper || typeof wrapper !== "object") return undefined;
  const v = (wrapper as { value?: unknown }).value;
  if (!v || typeof v !== "object") return undefined;
  if ("value" in v && "role" in v) {
    return (v as { value: T }).value;
  }
  return v as T;
};

const unwrapBlock = (wrapper: unknown): Block | undefined => unwrap<Block>(wrapper);


// Value processors for each field type
const valueProcessors = {
  text: (value: TextValue): string => {
    return value?.[0]?.[0] || "";
  },

  checkbox: (value: CheckboxValue): boolean => {
    return value?.[0]?.[0] === "Yes";
  },

  date: (value: DateValue): string | null => {
    return value?.[0]?.[1]?.[0]?.[1]?.start_date || null;
  },

  relation: (value: RelationValue): string[] => {
    if (!Array.isArray(value)) return [];

    return value
      .filter(
        (item): item is ["‣", [["p", string, string]]] =>
          item[0] === "‣" && Array.isArray(item[1]) && Array.isArray(item[1][0]) && item[1][0].length === 3,
      )
      .map((item) => item[1][0][1]);
  },

  title: (value: TitleValue): string => {
    return value?.[0]?.[0] || "";
  },

  multi_select: (value: MultiSelectValue): string[] => {
    return value?.[0] || [];
  },

  last_edited_time: (value: any): number => {
    return value;
  },
  image: (value: any): string | null => {
    // Check if the value has a file URL in Notion's format
    if (value?.[0]?.[1]?.[0]?.[1]) {
      return value[0][1][0][1];
    }
    // Check for direct URL format
    if (typeof value?.[0]?.[0] === 'string' && value[0][0].startsWith('http')) {
      return value[0][0];
    }
    return null;
  },

  // Add cover image processor for page cover
  cover_image: (format: any): string | null => {
    return format?.page_cover || null;
  }
};

// Process a single field based on its schema type
const processField = (value: any, schemaField: SchemaField): string | string[] | boolean | number | null => {
  const processor = valueProcessors[schemaField.type as keyof typeof valueProcessors];
  if (!processor) {
    console.warn(`No processor found for type: ${schemaField.type}`);
    return null;
  }
  return processor(value);
};

// Main processor function
export const processNotionData = (data: NotionData, schema: NotionDataSchema) => {
  if (!data.properties || !schema) {
    console.warn("Invalid input data or schema");
    return null;
  }
  const result: Record<string, any> = {
    id: data.id,
    createdTime: data.createdTime,
    lastEditedTime: data.lastEditedTime,
  };


  // Process each property based on its schema type
  Object.entries(data.properties).forEach(([key, value]) => {
    const schemaField = schema[key];
    if (schemaField) {
      result[schemaField.name] = processField(value, schemaField);
    }
  });

  return result;
};

/**
 * Process the record map to extract useful data
 */
export const processRecordMap = async (recordMap: ExtendedRecordMap) => {
  const blocks = Object.values(recordMap.block)
    .map(unwrapBlock)
    .filter((b): b is Block => Boolean(b));
  const previewImageMap = await getPreviewImageMap(recordMap);

  // Find the root page block
  const pageBlock = blocks.find((block) => block.type === 'page') as PageBlock | undefined;

  if (!pageBlock) {
    throw new Error('No page block found');
  }

  // Extract page properties
  const title = pageBlock.properties?.title?.[0]?.[0] || '';
  const icon = pageBlock.format?.page_icon || null;

  // Get all content blocks
  const contentBlocks = blocks.filter((block) => block.parent_id === pageBlock.id);

  return {
    id: pageBlock.id,
    title,
    icon,
    coverImage: previewImageMap,
    contentBlocks,
    lastEditedTime: pageBlock.last_edited_time,
    createdTime: pageBlock.created_time,
    fullRecordMap: recordMap,
  };
};



export const getPreviewImageMap = async (recordMap: ExtendedRecordMap) => {
  const previewImagesMap: Record<string, string> = {};

  const pageBlocks = Object.values(recordMap.block)
    .map(unwrapBlock)
    .filter((b): b is Block => Boolean(b) && b!.type === 'page');

  pageBlocks.forEach((block) => {
    const pageId = block.id;
    const format = block.format as { page_cover?: string } | undefined;

    if (format?.page_cover) {
      const coverUrl = format.page_cover;
      previewImagesMap[pageId] = `https://www.notion.so/image/${encodeURIComponent(coverUrl)}?table=block&id=${pageId}&cache=v2`;
    }
  });

  return previewImagesMap;
};

export const getPreviewImageForBlock = (block: any): string | null => {
  const format = block?.value?.format;

  if (format && format?.page_cover) {
    const pageId = block.value.id;
    const coverUrl = format.page_cover;

    // Use Notion's image proxy to handle S3 URLs and other image sources
    return `https://www.notion.so/image/${encodeURIComponent(coverUrl)}?table=block&id=${pageId}&cache=v2`;
  }

  return null;
};

export const getImageUrlForBlock2 = (block: any): string | null => {
  if (block.type === "image" && block.imageUrl) {
    // Use the block's actual ID in the URL query parameter
    const blockId = block.id;
    const originalUrl = block.imageUrl;

    // Check if this is already a Notion proxy URL
    if (originalUrl.startsWith("https://www.notion.so/image/")) {
      // Extract the original URL and rebuild with correct ID
      const encodedOriginalUrl = originalUrl.split("https://www.notion.so/image/")[1].split("?")[0];
      const originalImageUrl = decodeURIComponent(encodedOriginalUrl);

      return `https://www.notion.so/image/${encodeURIComponent(originalImageUrl)}?table=block&id=${blockId}&cache=v2`;
    } else {
      // Direct image URL case
      return `https://www.notion.so/image/${encodeURIComponent(originalUrl)}?table=block&id=${blockId}&cache=v2`;
    }
  }

  return null;
};


export const processDatabaseContent = async (
  recordMap: ExtendedRecordMap,
): Promise<{
  id: string;
  collection: Collection;
  rows: NotionRowsData;
  schema: NotionDataSchema;
  fullRecordMap: ExtendedRecordMap;
}> => {
  const blocks = Object.values(recordMap.block)
    .map(unwrapBlock)
    .filter((b): b is Block => Boolean(b));
  const previewImageMap = await getPreviewImageMap(recordMap);

  // Filter for collection_view_page or collection_view blocks
  const collectionBlock = blocks.find(
    (block) => block.type.includes('collection_view'),
  ) as CollectionViewBlock | undefined;

  if (!collectionBlock) {
    throw new Error('No database found');
  }

  const collectionId = collectionBlock.collection_id;
  if (!collectionId) {
    throw new Error('No collection id found');
  }
  const collection = unwrap<Collection>(recordMap.collection[collectionId]);

  if (!collection) {
    throw new Error('No collection data found');
  }
  if (!collection.schema) {
    throw new Error('Collection schema missing (check Notion share permissions)');
  }

  // Filter blocks that are direct children of the collection
  const rowBlocks = blocks.filter((block) => block.parent_id === collectionId);

  // Map each block to a structured row object
  const rows = rowBlocks.map((block) => {
    const { id, properties, created_time, last_edited_time, format } = block;

    // Get the cover image from our previewImageMap
    const coverImage = previewImageMap[id] || null;

    // Generate the public URL for this page
    const url = `https://notion.so/${id.replace(/-/g, '')}`;

    return {
      id,
      properties,
      format,
      createdTime: created_time,
      lastEditedTime: last_edited_time,
      coverImage,
      url
    };
  });

  // Process each row with your schema normalization
  const normalizeData = rows.map(row => {
    const processed = processNotionData(row, collection.schema);

    // Add the coverImage and url properties to the processed data
    return {
      ...processed,
      coverImage: row.coverImage,
      url: row.url,
      pageId: row.id
    };
  });

  return {
    id: collectionBlock.id,
    collection,
    rows: normalizeData,
    schema: collection.schema,
    fullRecordMap: recordMap,
  };
};