import type {
  PageObjectResponse,
  DatabaseObjectResponse,
  RichTextItemResponse,
  GetPagePropertyResponse,
  ListDatabasesResponse,
  QueryDatabaseResponse,
  CreateDatabaseParameters,
  CreatePageParameters,
} from "@notionhq/client/build/src/api-endpoints";

// Notionのページ関連の型定義
export type NotionPage = PageObjectResponse;
export type NotionPageProperties = CreatePageParameters["properties"];

// Notionのデータベース関連の型定義
export type NotionDatabase = DatabaseObjectResponse;
export type NotionDatabaseProperties = CreateDatabaseParameters["properties"];

// テスト用のモック型定義
export type MockPageResponse = PageObjectResponse;
export type MockDatabaseResponse = DatabaseObjectResponse;

// その他の型定義
export type {
  RichTextItemResponse,
  GetPagePropertyResponse,
  ListDatabasesResponse,
  QueryDatabaseResponse,
}; 