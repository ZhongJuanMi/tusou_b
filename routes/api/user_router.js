var router = require('koa-router')()
var user_controller = require('../../app/controllers/user_controller')
var {imgupload} = require('../../app/utils/upload')
router.post('/logUser', user_controller.logUser)
router.get('/ifUser', user_controller.ifUser)
router.post('/registerUser', user_controller.registerUser)
router.get('/getUser', user_controller.getUser)
router.post('/setInfo', imgupload.single('file'),user_controller.setInfo)

module.exports = router
