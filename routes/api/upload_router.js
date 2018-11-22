var router = require('koa-router')()
var upload_controller = require('../../app/controllers/upload_controller')
var {imgupload} = require('../../app/utils/upload')
router.post('/imgupload',imgupload.single('file'),async (ctx,next)=>{
  console.log(789,ctx.req.body);
  next()
  ctx.body = ctx.req.file.path.substr(7)
});

module.exports = router
