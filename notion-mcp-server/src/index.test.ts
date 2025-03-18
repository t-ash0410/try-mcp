import { describe, expect, test, mock, beforeAll, afterEach } from "bun:test";

// NotionClientのモック
const mockCreatePage = mock(() => Promise.resolve({ id: "test-page-id" }));
const mockCreateDatabase = mock(() => Promise.resolve({ id: "test-database-id" }));
const mockAddDatabaseRow = mock(() => Promise.resolve({ id: "test-row-id" }));

mock.module("./notion-client", () => ({
  notionClient: {
    createPage: mockCreatePage,
    createDatabase: mockCreateDatabase,
    addDatabaseRow: mockAddDatabaseRow,
  },
}));

// コンソール出力のモック
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const mockConsoleLog = mock(() => {});
const mockConsoleError = mock(() => {});

describe("CLI", () => {
  beforeAll(() => {
    // コンソール出力をモック化
    console.log = mockConsoleLog;
    console.error = mockConsoleError;
    process.env.NOTION_API_KEY = "test-api-key";
  });

  afterEach(() => {
    // モックをリセット
    mockCreatePage.mockClear();
    mockCreateDatabase.mockClear();
    mockAddDatabaseRow.mockClear();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  test("createPage command", async () => {
    process.argv = ["bun", "index.ts", "createPage", "parent-id", "Test Page", "Test Content"];
    await import("./index");

    expect(mockCreatePage).toHaveBeenCalledWith("parent-id", "Test Page", "Test Content");
    expect(mockConsoleLog).toHaveBeenCalledWith("Created page:", "test-page-id");
  });

  test("createDatabase command", async () => {
    process.argv = ["bun", "index.ts", "createDatabase", "parent-id", "Test Database"];
    await import("./index");

    expect(mockCreateDatabase).toHaveBeenCalledWith(
      "parent-id",
      "Test Database",
      {
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
      }
    );
    expect(mockConsoleLog).toHaveBeenCalledWith("Created database:", "test-database-id");
  });

  test("addDatabaseRow command", async () => {
    process.argv = ["bun", "index.ts", "addDatabaseRow", "database-id", "Test Task"];
    await import("./index");

    expect(mockAddDatabaseRow).toHaveBeenCalledWith(
      "database-id",
      {
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
      }
    );
    expect(mockConsoleLog).toHaveBeenCalledWith("Added row:", "test-row-id");
  });

  test("invalid command", async () => {
    process.argv = ["bun", "index.ts", "invalidCommand", "parent-id", "Test"];
    await import("./index");

    expect(mockConsoleError).toHaveBeenCalledWith("Unknown command:", "invalidCommand");
  });

  test("missing arguments", async () => {
    process.argv = ["bun", "index.ts", "createPage"];
    await import("./index");

    expect(mockConsoleError).toHaveBeenCalledWith(
      "Usage: bun run index.ts <command> <parentId> <title> [content]"
    );
  });
}); 