exports.imgupload=async (ctx,next)=>{
  ctx.body = ctx.req.file.path.substr(7)
}
