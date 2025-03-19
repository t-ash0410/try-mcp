import { NOTION_PARENT_ID, getNotionClient } from '@/common/notion'
import type { Tool } from '@modelcontextprotocol/sdk/types.js'

export interface CreateDBArgs {
  title: string
}

export const createDBTool: Tool = {
  name: 'create_db',
  description: 'Create a new database',
  inputSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'The title of the database',
      },
    },
    required: ['title'],
  },
}

export const createDBHandler = async (args: CreateDBArgs) => {
  const notion = getNotionClient()
  const { title } = args
  return await notion.databases.create({
    parent: { page_id: NOTION_PARENT_ID },
    title: [{ text: { content: title } }],
    properties: {},
  })
}
