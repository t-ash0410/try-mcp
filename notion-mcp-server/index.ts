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
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("Usage: bun run index.ts <command> <parentId> <title> [content]");
    process.exit(1);
  }

  const [command, parentId, title, content = ""] = args;

  try {
    switch (command) {
      case "createPage": {
        const page = await createPage(parentId, title, content);
        console.log("Created page:", page.id);
        break;
      }
      case "createDatabase": {
        const database = await createDatabase(parentId, title, {
          Name: { title: {} },
          Status: { select: { options: [{ name: "Not started" }] } },
        });
        console.log("Created database:", database.id);
        break;
      }
      case "addDatabaseRow": {
        const row = await addDatabaseRow(parentId, {
          Name: {
            title: [
              {
                text: {
                  content: title,
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
        break;
      }
      default:
        console.error("Unknown command:", command);
        process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}