import type { ExtendedRecordMap } from "notion-types";

import type { BlockContent, FormattedText, ListItem } from "./types";

const proxyNotionImage = (url: string, blockId: string): string => {
  if (!url) return "";
  if (url.startsWith("data:")) return url;
  if (url.startsWith("https://www.notion.so/image/")) return url;
  return `https://www.notion.so/image/${encodeURIComponent(url)}?table=block&id=${blockId}&cache=v2`;
};

// Notion stores rich text as: [["Hello ", [["b"]]], ["world", [["i"]]]]
// Convert to { text, formatting: [{type,start,end,href?}] }
const parseRichText = (raw: unknown): FormattedText => {
  if (!Array.isArray(raw)) return { text: "", formatting: [] };

  let text = "";
  const formatting: FormattedText["formatting"] = [];

  for (const segment of raw) {
    if (!Array.isArray(segment)) continue;
    const chunk = typeof segment[0] === "string" ? segment[0] : "";
    const formats = Array.isArray(segment[1]) ? segment[1] : [];
    const start = text.length;
    text += chunk;
    const end = text.length;

    for (const fmt of formats) {
      if (!Array.isArray(fmt)) continue;
      const type = fmt[0];
      if (type === "b" || type === "i" || type === "c" || type === "s") {
        formatting.push({ type, start, end });
      } else if (type === "a") {
        const href = typeof fmt[1] === "string" ? fmt[1] : undefined;
        formatting.push({ type: "a", start, end, href });
      }
    }
  }

  return { text, formatting };
};

type AnyBlock = {
  value?: {
    id: string;
    type: string;
    parent_id?: string;
    properties?: Record<string, unknown>;
    format?: Record<string, unknown>;
    content?: string[];
  };
};

const blockToListItem = (block: AnyBlock["value"]): ListItem | null => {
  if (!block) return null;
  const title = (block.properties as { title?: unknown } | undefined)?.title;
  return { id: block.id, text: parseRichText(title) };
};

const mapSingleBlock = (block: AnyBlock["value"]): BlockContent | null => {
  if (!block) return null;
  const { id, type, properties = {}, format = {} } = block;
  const p = properties as Record<string, unknown>;
  const f = format as Record<string, unknown>;

  switch (type) {
    case "header":
      return { id, type: "heading_1", text: parseRichText(p.title) };
    case "sub_header":
      return { id, type: "heading_2", text: parseRichText(p.title) };
    case "sub_sub_header":
      return { id, type: "heading_3", text: parseRichText(p.title) };
    case "text":
      return { id, type: "paragraph", text: parseRichText(p.title) };
    case "quote":
      return { id, type: "quote", text: parseRichText(p.title) };
    case "callout":
      return {
        id,
        type: "callout",
        text: parseRichText(p.title),
        icon: typeof f.page_icon === "string" ? (f.page_icon as string) : undefined,
      };
    case "divider":
      return { id, type: "divider" };
    case "code": {
      const code = parseRichText(p.title).text;
      const language = parseRichText(p.language).text || undefined;
      return { id, type: "code", code, language };
    }
    case "image": {
      const source = parseRichText(p.source).text;
      const displaySource = typeof f.display_source === "string" ? (f.display_source as string) : source;
      const caption = parseRichText(p.caption).text;
      const width = typeof f.block_width === "number" ? (f.block_width as number) : undefined;
      const height = typeof f.block_height === "number" ? (f.block_height as number) : undefined;
      return {
        id,
        type: "image",
        imageUrl: proxyNotionImage(displaySource, id),
        caption: caption || undefined,
        width,
        height,
      };
    }
    default:
      return null;
  }
};

// Handles double-nested wrappers: { role, value: { role, value: Block } }.
const unwrapValue = (wrapper: unknown): AnyBlock["value"] | undefined => {
  if (!wrapper || typeof wrapper !== "object") return undefined;
  const v = (wrapper as { value?: unknown }).value;
  if (!v || typeof v !== "object") return undefined;
  if ("value" in v && "role" in v) {
    return (v as { value: AnyBlock["value"] }).value;
  }
  return v as AnyBlock["value"];
};

// Collapse consecutive bulleted_list / numbered_list blocks into grouped items.
export const extractContentBlocks = (
  recordMap: ExtendedRecordMap,
  pageId: string,
): BlockContent[] => {
  const getValue = (id: string): AnyBlock["value"] | undefined =>
    unwrapValue(recordMap.block[id]);

  const root = getValue(pageId);
  if (!root) return [];

  const childIds: string[] = Array.isArray(root.content) ? root.content : [];
  const result: BlockContent[] = [];

  let i = 0;
  while (i < childIds.length) {
    const block = getValue(childIds[i]);
    if (!block) {
      i += 1;
      continue;
    }

    if (block.type === "bulleted_list" || block.type === "numbered_list") {
      const listType = block.type === "bulleted_list" ? "bulleted_list" : "numbered_list";
      const items: ListItem[] = [];
      while (i < childIds.length) {
        const b = getValue(childIds[i]);
        if (!b || b.type !== block.type) break;
        const li = blockToListItem(b);
        if (li) items.push(li);
        i += 1;
      }
      if (items.length) {
        result.push({ id: `${listType}-${items[0].id}`, type: listType, items });
      }
      continue;
    }

    const mapped = mapSingleBlock(block);
    if (!mapped) {
      console.log("[blog:detail] unmapped block type:", block.type);
    } else {
      result.push(mapped);
    }
    i += 1;
  }

  console.log("[blog:detail] mapped blocks:", result.length);
  return result;
};
