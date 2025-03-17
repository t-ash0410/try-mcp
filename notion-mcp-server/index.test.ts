import { expect, test, beforeEach } from "bun:test";
import { createPage, createDatabase, addDatabaseRow } from "./index";

// テスト用の環境変数を設定
process.env.NOTION_API_KEY = "test_api_key";

// テストケース
test("createPage", async () => {
  const title = "Test Page";
  const parentId = "test-parent-id";
  const result = await createPage(title, parentId);

  expect(result).toBeDefined();
  expect(result.id).toBeDefined();
});

test("createDatabase", async () => {
  const title = "Test Database";
  const parentId = "test-parent-id";
  const result = await createDatabase(title, parentId);

  expect(result).toBeDefined();
  expect(result.id).toBeDefined();
});

test("addDatabaseRow", async () => {
  const databaseId = "test-database-id";
  const title = "Test Row";
  const result = await addDatabaseRow(databaseId, title);

  expect(result).toBeDefined();
  expect(result.id).toBeDefined();
}); 