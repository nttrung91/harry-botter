const KoaRouter = require('koa-router')
const AtgController = require('../controllers/AtgController')

const router = new KoaRouter()

router
  .get('/', async ctx => (ctx.body = 'Welcome to Harry Botter API!'))
  .post('/account/login', AtgController.login)
  .get('/orders/recent', AtgController.getRecentOrder)
module.exports = router
