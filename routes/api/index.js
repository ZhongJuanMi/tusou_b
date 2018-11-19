const router = require('koa-router')()
const user_router = require('./user_router')
const weight_router = require('./weight_router')
const blog_router = require('./blog_router')

router.use('/users', user_router.routes(), user_router.allowedMethods())
router.use('/weights', weight_router.routes(), weight_router.allowedMethods())
router.use('/blog', blog_router.routes(), blog_router.allowedMethods())

module.exports = router