import { describe, expect, test, mock, beforeAll } from "bun:test";
import type { Client as NotionApiClient } from "@notionhq/client";
import type {
  MockPageResponse,
  MockDatabaseResponse,
  RichTextItemResponse,
  GetPagePropertyResponse,
  ListDatabasesResponse,
  QueryDatabaseResponse,
} from "./types";

// Notionクライアントのモック
const mockNotionClient = {
  pages: {
    create: mock((params) => {
      return Promise.resolve<MockPageResponse>({
        id: "test-page-id",
        object: "page",
        created_time: new Date().toISOString(),
        last_edited_time: new Date().toISOString(),
        parent: params.parent,
        archived: false,
        url: "https://www.notion.so/test-page-id",
        properties: {},
        icon: null,
        cover: null,
        created_by: { id: "test-user-id", object: "user" },
        last_edited_by: { id: "test-user-id", object: "user" },
        in_trash: false,
        public_url: "https://www.notion.so/test-page-id",
      } as MockPageResponse);
    }),
    // 型を満たすために必要な空のモック
    retrieve: mock(() => Promise.resolve({} as MockPageResponse)),
    update: mock(() => Promise.resolve({} as MockPageResponse)),
    properties: {
      get: mock(() => Promise.resolve({} as GetPagePropertyResponse)),
      retrieve: mock(() => Promise.resolve({} as GetPagePropertyResponse)),
    },
  },
  databases: {
    create: mock((params) => {
      return Promise.resolve<MockDatabaseResponse>({
        id: "test-database-id",
        object: "database",
        created_time: new Date().toISOString(),
        last_edited_time: new Date().toISOString(),
        parent: params.parent,
        archived: false,
        url: "https://www.notion.so/test-database-id",
        properties: params.properties,
        icon: null,
        cover: null,
        created_by: { id: "test-user-id", object: "user" },
        last_edited_by: { id: "test-user-id", object: "user" },
        title: [{ type: "text", text: { content: "Test Database", link: null } }] as RichTextItemResponse[],
        description: [],
        is_inline: false,
        in_trash: false,
        public_url: "https://www.notion.so/test-database-id",
      } as MockDatabaseResponse);
    }),
    // 型を満たすために必要な空のモック
    list: mock(() => Promise.resolve({} as ListDatabasesResponse)),
    retrieve: mock(() => Promise.resolve({} as MockDatabaseResponse)),
    query: mock(() => Promise.resolve({} as QueryDatabaseResponse)),
    update: mock(() => Promise.resolve({} as MockDatabaseResponse)),
  },
};

// @notionhq/clientのモック
mock.module("@notionhq/client", () => {
  class MockClient implements Partial<NotionApiClient> {
    pages = mockNotionClient.pages;
    databases = mockNotionClient.databases;
  }
  return { Client: MockClient };
});

// テスト対象のモジュールをインポート
import { NotionClient } from "./notion-client";

describe("NotionClient", () => {
  let client: NotionClient;

  beforeAll(() => {
    // テスト環境用の環境変数を設定
    process.env.NOTION_API_KEY = "test-api-key";
    client = new NotionClient();
  });

  test("createPage", async () => {
    const result = await client.createPage(
      "test-parent-id",
      "Test Page",
      "Test Content"
    );

    expect(result).toBeDefined();
    expect(result.id).toBe("test-page-id");
    expect(mockNotionClient.pages.create).toHaveBeenCalledWith({
      parent: { page_id: "test-parent-id" },
      properties: {
        title: {
          title: [
            {
              text: {
                content: "Test Page",
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
                  content: "Test Content",
                },
              },
            ],
          },
        },
      ],
    });
  });

  test("createDatabase", async () => {
    const properties = {
      Name: {
        title: {},
        type: "title" as const,
      },
      Status: {
        select: {
          options: [{ name: "Not started" }],
        },
        type: "select" as const,
      },
    };

    const result = await client.createDatabase(
      "test-parent-id",
      "Test Database",
      properties
    );

    expect(result).toBeDefined();
    expect(result.id).toBe("test-database-id");
    expect(mockNotionClient.databases.create).toHaveBeenCalledWith({
      parent: { page_id: "test-parent-id" },
      title: [
        {
          text: {
            content: "Test Database",
          },
        },
      ],
      properties,
    });
  });

  test("addDatabaseRow", async () => {
    const properties = {
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
    };

    const result = await client.addDatabaseRow("test-database-id", properties);

    expect(result).toBeDefined();
    expect(result.id).toBe("test-page-id");
    expect(mockNotionClient.pages.create).toHaveBeenCalledWith({
      parent: { database_id: "test-database-id" },
      properties,
    });
  });
}); 