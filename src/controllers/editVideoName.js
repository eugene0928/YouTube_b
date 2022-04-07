const { AuthorizationError, InternalServerError } = require( '../utils/error.js' )
const path = require( 'path' )

const POST = (req, res, next) => {
    try {
        const { videoId, videoTitle } = req.body

        let videos = req.readFile( 'videos' )
        const neededVideo = videos.find( video  => video.videoId == videoId)

        if( !neededVideo ) {
            return next( new AuthorizationError( 400, "The video does not exist" ) )
        }
        
        if( !videoTitle ) {
            return next( new AuthorizationError( 400, "Title is required" ) )
        }

        neededVideo.videoTitle = videoTitle
        req.writeFile( 'videos', videos )
        res.status( 200 ).json( {status: 200, message: 'Title is edited successfully', data: Date.now()} )
    } catch (err) {
        next( new InternalServerError( 500, err.message ) )
    }
}

module.exports = {
    POST
}