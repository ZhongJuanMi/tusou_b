var router = require('koa-router')()

router.post('/getweather',async (ctx,next)=>{
  console.log(789,ctx.req.body);
  next()
  ctx.body = ctx.req.file.path.substr(7)
});

module.exports = router