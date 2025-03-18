import type { NotionPageProperties, NotionDatabaseProperties } from "./types";
import { notionClient } from "./notion-client";

export async function createPage(
  parentId: string,
  title: string,
  content: string
) {
  return await notionClient.createPage(parentId, title, content);
}

export async function createDatabase(
  parentId: string,
  title: string,
  properties: NotionDatabaseProperties
) {
  return await notionClient.createDatabase(parentId, title, properties);
}

export async function addDatabaseRow(
  databaseId: string,
  properties: NotionPageProperties
) {
  return await notionClient.addDatabaseRow(databaseId, properties);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("Usage: bun run index.ts <command> <parentId> <title> [content]");
    process.exit(1);
  }

  const [command, parentId, title, content = ""] = args;

  // 必須パラメータのチェック
  if (!parentId || !title) {
    console.error("Error: parentId and title are required");
    process.exit(1);
  }

  try {
    switch (command) {
      case "createPage": {
        const page = await createPage(parentId, title, content);
        console.log("Created page:", page.id);
        break;
      }
      case "createDatabase": {
        const database = await createDatabase(parentId, title, {
          Name: {
            title: {},
            type: "title",
          },
          Status: {
            select: {
              options: [{ name: "Not started" }],
            },
            type: "select",
          },
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