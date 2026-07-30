import { Client, isFullDatabase, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export const categories = [
  "Law & Policy",
  "Jyotish",
  "Political Philosophy",
  "Chamber Notes",
] as const;

export type Category = (typeof categories)[number];

export type BlogPostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
};

export type BlogPost = BlogPostSummary & {
  content: string;
  readingTimeMinutes: number;
};

function isConfigured() {
  return Boolean(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);
}

function getClient() {
  return new Client({ auth: process.env.NOTION_API_KEY });
}

// Notion's 2025-09 API split databases into one or more "data sources";
// queries run against a data source id, not the database id directly.
async function getDataSourceId(notion: Client): Promise<string> {
  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID as string,
  });
  const dataSourceId = isFullDatabase(database)
    ? database.data_sources[0]?.id
    : undefined;
  if (!dataSourceId) {
    throw new Error("Notion database has no data source.");
  }
  return dataSourceId;
}

function plainText(richText: { plain_text: string }[] | undefined): string {
  return (richText ?? []).map((t) => t.plain_text).join("");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSummary(page: any): BlogPostSummary | null {
  const props = page.properties;
  const title = plainText(props.Title?.title);
  const slug = plainText(props.Slug?.rich_text);
  if (!title || !slug) return null;

  return {
    slug,
    title,
    excerpt: plainText(props.Excerpt?.rich_text),
    category: props.Category?.select?.name ?? "Chamber Notes",
    date: props.Date?.date?.start ?? "",
  };
}

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  if (!isConfigured()) return [];

  const notion = getClient();
  const dataSourceId = await getDataSourceId(notion);
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: { property: "Status", select: { equals: "Published" } },
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return response.results
    .filter(isFullPage)
    .map(toSummary)
    .filter((p): p is BlogPostSummary => p !== null);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isConfigured()) return null;

  const notion = getClient();
  const dataSourceId = await getDataSourceId(notion);
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        { property: "Status", select: { equals: "Published" } },
        { property: "Slug", rich_text: { equals: slug } },
      ],
    },
    page_size: 1,
  });

  const page = response.results.filter(isFullPage)[0];
  if (!page) return null;

  const summary = toSummary(page);
  if (!summary) return null;

  const n2m = new NotionToMarkdown({ notionClient: notion });
  const blocks = await n2m.pageToMarkdown(page.id);
  const { parent: content } = n2m.toMarkdownString(blocks);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

  return { ...summary, content, readingTimeMinutes };
}
