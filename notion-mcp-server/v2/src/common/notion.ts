import { Client } from '@notionhq/client'

const parentId = process.env.NOTION_PARENT_ID
export const NOTION_PARENT_ID = parentId ?? ''

let notionClient: Client

export function getNotionClient() {
  if (!notionClient) {
    notionClient = new Client({ auth: process.env.NOTION_API_KEY })
  }
  return notionClient
}
