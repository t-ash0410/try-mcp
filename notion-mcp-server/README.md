# notion-mcp-server

NotionのMCPサーバーを実装したプロジェクトです。

## 機能

- Notionに任意の名称でページを作成
- 任意のページにデータベースを作成
- 任意のデータベースに行（ページ）を追加

## セットアップ

1. 依存関係のインストール:
```bash
bun install
```

2. 環境変数の設定:
`.env`ファイルを作成し、以下の内容を追加してください：
```
NOTION_API_KEY=your_notion_api_key
```

## 使用方法

1. ページの作成:
```typescript
import { createPage } from "./index.ts";

const page = await createPage("ページ名", "親ページID");
```

2. データベースの作成:
```typescript
import { createDatabase } from "./index.ts";

const database = await createDatabase("データベース名", "親ページID");
```

3. データベースに行を追加:
```typescript
import { addDatabaseRow } from "./index.ts";

const row = await addDatabaseRow("データベースID", "行のタイトル");
```

## 開発

このプロジェクトは以下の技術スタックを使用しています：

- Bun (ランタイム、パッケージマネージャー)
- TypeScript
- @notionhq/client (Notion APIクライアント)

## テスト

テストを実行するには：
```bash
bun test
```
