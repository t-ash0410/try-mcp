import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const app = new Hono()
  .use('*', createMiddleware(async (c, next) => {
    console.log({
      message: `Request received ${c.req.url}`,
      headers: c.req.header(),
      body: await c.req.text(),
    })
    await next()
  }))
  .get('/health', (c) => {
    return c.json({
      status: 'ok',
    })
  })

export default app
