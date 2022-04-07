const { InternalServerError } = require( '../utils/error.js' )

const GET = ( req, res, next ) => {
    try {
        const videos = req.readFile( 'videos' )

        res.status( 200 ).json( videos )
    } catch (err) {
        next(new InternalServerError( 500, err.message ))
    }
}

const GETUSERVIDEO = ( req, res, next ) => {
    try {
        const videos = req.readFile( 'videos' )
        const id = req.params.id

        const spesificVideos = videos.filter( video => video.userId == id )
        res.status( 200 ).json( spesificVideos )
    } catch (err) {
        next(new InternalServerError( 500, err.message ))
    }
}

module.exports = {
    GET, GETUSERVIDEO
}