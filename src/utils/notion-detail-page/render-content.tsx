import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

import type { BlockContent, FormattedText, ListItem } from "./types";

export const renderFormattedText = (content: FormattedText) => {
  if (!content.formatting || content.formatting.length === 0) {
    return content.text;
  }

  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  const sortedFormatting = [...content.formatting].sort((a, b) => a.start - b.start);

  for (const format of sortedFormatting) {
    if (format.start > lastIndex) {
      segments.push(
        <span key={`text-${lastIndex}`}>
          {content.text.substring(lastIndex, format.start)}
        </span>,
      );
    }

    const formattedText = content.text.substring(format.start, format.end);
    switch (format.type) {
      case "b":
        segments.push(<strong key={`b-${format.start}`}>{formattedText}</strong>);
        break;
      case "i":
        segments.push(<em key={`i-${format.start}`}>{formattedText}</em>);
        break;
      case "c":
        segments.push(
          <code
            key={`c-${format.start}`}
            className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.875em] text-neutral-900"
          >
            {formattedText}
          </code>,
        );
        break;
      case "s":
        segments.push(<s key={`s-${format.start}`}>{formattedText}</s>);
        break;
      case "a":
        segments.push(
          <a
            key={`a-${format.start}`}
            href={format.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
          >
            {formattedText}
          </a>,
        );
        break;
      default:
        segments.push(<span key={`t-${format.start}`}>{formattedText}</span>);
    }

    lastIndex = format.end;
  }

  if (lastIndex < content.text.length) {
    segments.push(<span key="text-end">{content.text.substring(lastIndex)}</span>);
  }

  return <>{segments}</>;
};

const renderListItem = (item: ListItem) => renderFormattedText(item.text);

export const renderContent = (
  content: BlockContent[],
  imageAltFallback?: string,
) => {
  return content.map((block) => {
    switch (block.type) {
      case "heading_1":
        return (
          <h2 key={block.id} className="mt-10 mb-4 text-3xl font-bold tracking-tight text-neutral-900">
            {renderFormattedText(block.text)}
          </h2>
        );

      case "heading_2":
        return (
          <h3 key={block.id} className="mt-8 mb-3 text-2xl font-semibold tracking-tight text-neutral-900">
            {renderFormattedText(block.text)}
          </h3>
        );

      case "heading_3":
        return (
          <h4 key={block.id} className="mt-6 mb-2 text-xl font-semibold text-neutral-900">
            {renderFormattedText(block.text)}
          </h4>
        );

      case "paragraph":
        return (
          <p key={block.id} className="mb-4 text-base leading-7 text-neutral-700">
            {renderFormattedText(block.text)}
          </p>
        );

      case "quote":
        return (
          <blockquote
            key={block.id}
            className="my-6 border-l-4 border-neutral-300 pl-4 text-neutral-700 italic"
          >
            {renderFormattedText(block.text)}
          </blockquote>
        );

      case "callout":
        return (
          <div
            key={block.id}
            className="my-6 flex gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-neutral-800"
          >
            {block.icon && <span className="text-xl leading-none">{block.icon}</span>}
            <div className="flex-1">{renderFormattedText(block.text)}</div>
          </div>
        );

      case "divider":
        return <hr key={block.id} className="my-8 border-neutral-200" />;

      case "bulleted_list":
        return (
          <ul key={block.id} className="mb-4 ml-6 list-disc space-y-1.5 text-neutral-700">
            {block.items.map((item) => (
              <li key={item.id}>{renderListItem(item)}</li>
            ))}
          </ul>
        );

      case "numbered_list":
        return (
          <ol key={block.id} className="mb-4 ml-6 list-decimal space-y-1.5 text-neutral-700">
            {block.items.map((item) => (
              <li key={item.id}>{renderListItem(item)}</li>
            ))}
          </ol>
        );

      case "image":
        return (
          <figure key={block.id} className="my-6">
            <Image
              src={block.imageUrl}
              alt={block.caption || imageAltFallback || ""}
              width={block.width ?? 1200}
              height={block.height ?? 675}
              className="block h-auto w-full rounded-lg"
            />
            {block.caption && (
              <figcaption className="mt-2 text-center text-sm text-neutral-500">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );

      case "code":
        return (
          <Card key={block.id} className="my-6 overflow-hidden">
            <CardContent className="p-0">
              <pre
                className={`overflow-x-auto bg-neutral-50 p-4 font-mono text-sm text-neutral-900 language-${block.language ?? "plain"}`}
              >
                <code>{block.code}</code>
              </pre>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  });
};
