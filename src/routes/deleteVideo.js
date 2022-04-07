const controller = require( '../controllers/deleteVideo.js' )
const router = require( 'express' ).Router()

router.post( '/deletevideo', controller.POST )

module.exports = router