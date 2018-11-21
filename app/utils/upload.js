const multer = require('koa-multer')

const imgstorage = multer.diskStorage({
  destination: 'public/images/upload',
  filename(ctx, file, cb) {
    const filenameArr = file.originalname.split('.')
    cb(null, Date.now() + '.' + filenameArr[filenameArr.length - 1])
  }
})

exports.imgupload = multer({ storage:imgstorage })