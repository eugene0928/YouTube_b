const { AuthorizationError, InternalServerError } = require( '../utils/error.js' )
const path = require( 'path' )
const fs = require( 'fs' )
const JWT = require( '../utils/jwt.js' )

const POST = (req, res, next) => {
    try {
        const { videoId } = req.body
        const token = req.headers['token']
        const { userId } = JWT.verify( token )

        console.log( videoId )
        let users = req.readFile( 'users' )
        let videos = req.readFile( 'videos' )
        const neededUser = users.find( user  => user.userId == userId)
        const neededVideo = videos.find( video  => video.videoId == videoId)

        if( !neededUser ) {
            return next( new AuthorizationError( 400, "This user does not exist" ) )
        }
        
        if( !neededVideo ) {
            return next( new AuthorizationError( 400, "The video does not exist" ) )
        }
        
        videos = videos.filter( video => video.videoId != videoId )
        fs.unlinkSync( path.join(__dirname, '../', 'public', neededVideo.videoUrl) )
        req.writeFile( 'videos', videos )
        res.status( 200 ).json( {status: 200, message: 'Video is deleted successfully', data: Date.now()} )
    } catch (err) {
        next( new InternalServerError( 500, err.message ) )
    }
}

module.exports = {
    POST
}