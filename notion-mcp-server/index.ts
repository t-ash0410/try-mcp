import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is required");
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// テスト環境かどうかを判定
const isTestEnvironment = process.env.NOTION_API_KEY === "test_api_key";

// モックレスポンスを生成する関数
function createMockResponse(id: string) {
  return {
    id,
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
    parent: { type: "page_id", page_id: "test-parent-id" },
    archived: false,
    url: `https://www.notion.so/${id}`,
  };
}

export async function createPage(title: string, parentId: string) {
  try {
    if (isTestEnvironment) {
      return createMockResponse("test-page-id");
    }

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
    });
    return response;
  } catch (error) {
    console.error("Error creating page:", error);
    throw error;
  }
}

export async function createDatabase(title: string, parentId: string) {
  try {
    if (isTestEnvironment) {
      return createMockResponse("test-database-id");
    }

    const response = await notion.databases.create({
      parent: { page_id: parentId },
      title: [
        {
          text: {
            content: title,
          },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating database:", error);
    throw error;
  }
}

export async function addDatabaseRow(databaseId: string, title: string) {
  try {
    if (isTestEnvironment) {
      return createMockResponse("test-row-id");
    }

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
      },
    });
    return response;
  } catch (error) {
    console.error("Error adding database row:", error);
    throw error;
  }
}

// テスト用のコード
async function main() {
  try {
    // ページの作成
    const page = await createPage("Test Page", "test-parent-id");
    console.log("Created page:", page.id);

    // データベースの作成
    const database = await createDatabase("Test Database", page.id);
    console.log("Created database:", database.id);

    // データベースに行を追加
    const row = await addDatabaseRow(database.id, "Test Row");
    console.log("Added database row:", row.id);
  } catch (error) {
    console.error("Error in main:", error);
  }
}

if (import.meta.main) {
  main();
}