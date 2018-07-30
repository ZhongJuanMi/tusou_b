const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const router = require('koa-router')()
// CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
const cors = require('koa2-cors')
const index = require('./routes/index')
const users = require('./routes/users')
const api = require('./routes/api')
const response_formatter = require('./middlewares/response_formatter')
// app.use(jwtKoa({
//   secret
// }).unless({
//   path: [/^\/api\/users\/logUser/] //数组中的路径不需要通过jwt验证
// }))
// error handler
onerror(app)

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)
app.use(
  cors({
    origin: function (ctx) {
      return '*'
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'authorization']
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
)

app.use(response_formatter('^/api'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

app.use(router.routes(), router.allowedMethods())
router.use('/api', api.routes(), api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app