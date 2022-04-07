const controller = require( '../controllers/getVideo.js' )
const router = require( 'express' ).Router()

router.get( '/videos/:id', controller.GETUSERVIDEO )
router.get( '/videos', controller.GET )

module.exports = router