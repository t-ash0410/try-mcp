import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type { CallToolRequest } from '@modelcontextprotocol/sdk/types.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import {
  type CreateDBArgs,
  createDBHandler,
  createDBTool,
} from './tools/create-db'

async function main() {
  console.log('Starting Slack MCP Server...')

  const server = new Server(
    {
      name: 'Notion MCP Server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  )

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.log('Received CallToolRequest:', request)

      try {
        if (!request.params.arguments) {
          throw new Error('No arguments provided')
        }
        switch (request.params.name) {
          case 'create_db': {
            const args = request.params.arguments as unknown as CreateDBArgs
            if (!args.title) {
              throw new Error('Missing required arguments: title')
            }
            const response = await createDBHandler(args)
            return {
              content: [{ type: 'text', text: JSON.stringify(response) }],
            }
          }
          default: {
            throw new Error(`Unknown tool: ${request.params.name}`)
          }
        }
      } catch (error) {
        console.error('Error executing tool:', error)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
              }),
            },
          ],
        }
      }
    },
  )

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.log('Received ListToolsRequest')
    return {
      tools: [createDBTool],
    }
  })

  const transport = new StdioServerTransport()
  console.log('Connecting server to transport...')
  await server.connect(transport)

  console.log('Notion MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
