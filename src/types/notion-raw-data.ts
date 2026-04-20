import { Collection, CollectionPropertySchemaMap, ExtendedRecordMap } from "notion-types";

// Schema Types
export interface SchemaField {
  name: string;
  type: string;
  property?: string;
  version?: string;
  collection_id?: string;
  autoRelate?: {
    enabled: boolean;
  };
  collection_pointer?: {
    id: string;
    table: string;
    spaceId: string;
  };
}

export interface NotionDataSchema {
  [key: string]: SchemaField;
}

// Field Value Types
export type TextValue = string[][];
export type CheckboxValue = string[][];
export type DateValue = Array<["‣", [["d", { type: string; start_date: string }]]]>;
export type RelationValue = Array<["‣" | ",", [["p", string, string]]?]>;
export type TitleValue = string[][];
export type MultiSelectValue = string[][];

export interface NotionDataProperties {
  [key: string]: TextValue | CheckboxValue | DateValue | RelationValue | TitleValue | MultiSelectValue;
}

export interface NotionData {
  id: string;
  properties: NotionDataProperties;
  createdTime: number;
  lastEditedTime: number;
}

// export type NotionRowData = Record<string, any> | null
export type NotionRowData = Record<string, any>;

export type NotionRowsData = NotionRowData[];

export type RawNotionPageData = {
  id: string;
  collection: Collection;
  rows: NotionRowsData;
  schema: CollectionPropertySchemaMap;
  fullRecordMap: ExtendedRecordMap;
};
