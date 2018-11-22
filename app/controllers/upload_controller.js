exports.imgupload=async (ctx,next)=>{
  
  next()
  ctx.body = ctx.req.file.path.substr(7)
}
