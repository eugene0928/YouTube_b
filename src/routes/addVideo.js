const controller = require( '../controllers/addVideo.js' )
const router = require( 'express' ).Router()

router.post( '/addvideo', controller.POST )

module.exports = router