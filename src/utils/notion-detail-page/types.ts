export interface FormattedText {
  text: string;
  formatting: Array<{
    type: "b" | "i" | "c" | "s" | "a";
    start: number;
    end: number;
    href?: string;
  }>;
}

export interface ListItem {
  id: string;
  text: FormattedText;
}

export type BlockContent =
  | {
      id: string;
      type: "heading_1" | "heading_2" | "heading_3" | "paragraph" | "quote";
      text: FormattedText;
    }
  | {
      id: string;
      type: "bulleted_list" | "numbered_list";
      items: ListItem[];
    }
  | {
      id: string;
      type: "image";
      imageUrl: string;
      caption?: string;
      width?: number;
      height?: number;
    }
  | {
      id: string;
      type: "code";
      code: string;
      language?: string;
    }
  | {
      id: string;
      type: "divider";
    }
  | {
      id: string;
      type: "callout";
      text: FormattedText;
      icon?: string;
    };
