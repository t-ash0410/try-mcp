import { Client } from "@notionhq/client";
import type { CreateDatabaseParameters, CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function createPage(
  parentId: string,
  title: string,
  content: string
) {
  const response = await notion.pages.create({
    parent: { page_id: parentId },
    properties: {
      title: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: content,
              },
            },
          ],
        },
      },
    ],
  });

  return response;
}

export async function createDatabase(
  parentId: string,
  title: string,
  properties: CreateDatabaseParameters["properties"]
) {
  const response = await notion.databases.create({
    parent: { page_id: parentId },
    title: [
      {
        text: {
          content: title,
        },
      },
    ],
    properties: properties,
  });

  return response;
}

export async function addDatabaseRow(
  databaseId: string,
  properties: CreatePageParameters["properties"]
) {
  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: properties,
  });

  return response;
}

async function main() {
  const parentPageId = process.env.NOTION_PARENT_PAGE_ID || "";
  const testPageId = process.env.NOTION_TEST_PAGE_ID || "";

  // テストページを作成
  const page = await createPage(parentPageId, "Test Page", "This is a test page");
  console.log("Created page:", page.id);

  // データベースを作成
  const database = await createDatabase(testPageId, "Test Database", {
    Name: { title: {} },
    Status: { select: { options: [{ name: "Not started" }] } },
  });
  console.log("Created database:", database.id);

  // データベースに行を追加
  const row = await addDatabaseRow(database.id, {
    Name: {
      title: [
        {
          text: {
            content: "Test Task",
          },
        },
      ],
    },
    Status: {
      select: {
        name: "Not started",
      },
    },
  });
  console.log("Added row:", row.id);
}

if (import.meta.main) {
  main().catch(console.error);
}