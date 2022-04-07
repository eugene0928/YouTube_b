const controller = require( '../controllers/register.js' )
const router = require('express').Router()

router.post( '/register', controller.POST )

module.exports = router