var router = require('koa-router')()
var weight_controller = require('../../app/controllers/weight_controller')

router.post('/setWeight', weight_controller.setWeight)
router.get('/getWeight', weight_controller.getWeight)

module.exports = router
