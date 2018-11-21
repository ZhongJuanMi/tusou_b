exports.imgupload=(ctx,next)=>{
  ctx.body = ctx.req.file.path.substr(7)
}
