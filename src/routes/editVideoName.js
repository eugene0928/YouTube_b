const controller = require( '../controllers/editVideoName.js' )
const router = require( 'express' ).Router()

router.post( '/editname', controller.POST )


module.exports = router