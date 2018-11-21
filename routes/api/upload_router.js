var router = require('koa-router')()
var upload_controller = require('../../app/controllers/upload_controller')
var {imgupload} = require('../../app/utils/upload')
router.post('/imgupload',imgupload.single('file'),upload_controller.imgupload);

module.exports = router
