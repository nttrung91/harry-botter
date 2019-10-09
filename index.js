const Boom = require('boom')
const logger = require('koa-logger')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const contexts = require('./contexts')
const router = require('./middleware/router')

const app = new Koa()

// Load Koa contexts
for (let name in contexts) {
  app.context[name] = contexts[name]
}

// Middlewares
app.use(logger())
app.use(bodyParser())
app.use(router.routes())

/*
  A separate middle for responding to the OPTIONS requests, with the Allow header containing the allowed methods

  Read more:
  https://github.com/ZijianHe/koa-router#module_koa-router--Router+allowedMethods
*/
app.use(
  router.allowedMethods({
    throw: true,
    notImplemented: () => Boom.notImplemented(),
    methodNotAllowed: () => Boom.methodNotAllowed()
  })
)

const port = process.env.PORT || 3000
app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
)
