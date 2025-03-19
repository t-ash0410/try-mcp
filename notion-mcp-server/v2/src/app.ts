import { Hono } from 'hono'

const app = new Hono()
  // .use(initContext)
  // .use('*', informationLog)
  // .onError(errorHandler)
  .get('/health', (c) => {
    return c.json({
      status: 'ok',
    })
  })

export default app
