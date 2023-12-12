const router = require('express').Router();
const Controller = require('../controllers/controller')
const authentication = require('../middlewares/authentication')

router.post('/login', Controller.login)

router.use(authentication)

router.get('/books', Controller.readBooks)

module.exports = router