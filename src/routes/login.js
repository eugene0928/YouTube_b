const controller = require( '../controllers/login.js' )
const router = require( 'express' ).Router()

router.post( '/login', controller.POST )

module.exports = router