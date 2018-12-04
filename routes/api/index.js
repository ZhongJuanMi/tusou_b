const router = require('koa-router')()
const user_router = require('./user_router')
const weight_router = require('./weight_router')
const blog_router = require('./blog_router')
const upload_router = require('./upload_router')
const third_router = require('./third_router')

router.use('/users', user_router.routes(), user_router.allowedMethods())
router.use('/weights', weight_router.routes(), weight_router.allowedMethods())
router.use('/blog', blog_router.routes(), blog_router.allowedMethods())
router.use('/file', upload_router.routes(), upload_router.allowedMethods())
router.use('/third', third_router.routes(), third_router.allowedMethods())

module.exports = router