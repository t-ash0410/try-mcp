import { Client } from "@notionhq/client";
import type { NotionPageProperties, NotionDatabaseProperties } from "./types";

export class NotionClient {
  private client: Client;

  constructor(apiKey: string = process.env.NOTION_API_KEY || "") {
    this.client = new Client({ auth: apiKey });
  }

  async createPage(parentId: string, title: string, content: string) {
    return await this.client.pages.create({
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
  }

  async createDatabase(parentId: string, title: string, properties: NotionDatabaseProperties) {
    return await this.client.databases.create({
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
  }

  async addDatabaseRow(databaseId: string, properties: NotionPageProperties) {
    return await this.client.pages.create({
      parent: { database_id: databaseId },
      properties: properties,
    });
  }
}

// デフォルトのインスタンスをエクスポート
export const notionClient = new NotionClient(); 