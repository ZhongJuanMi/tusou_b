var router = require('koa-router')()
var blog_controller = require('../../app/controllers/blog_controller')

router.post('/addorsetBlog', blog_controller.addorsetBlog)
router.post('/delBlog', blog_controller.delBlog)
router.get('/getBlogTags', blog_controller.getBlogTags)
router.get('/getBlogList', blog_controller.getBlogList)
router.get('/getBlogDetail', blog_controller.getBlogDetail)
router.get('/getBlogTagsCom', blog_controller.getBlogTagsCom)
router.get('/getBlogListCom', blog_controller.getBlogListCom)
router.get('/getDraftList', blog_controller.getDraftList)

module.exports = router