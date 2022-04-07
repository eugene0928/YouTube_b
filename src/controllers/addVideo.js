const { AuthorizationError, InternalServerError } = require( '../utils/error.js' )
const path = require( 'path' )
const JWT = require( '../utils/jwt.js' )

const POST = (req, res, next) => {
    try {
        const { videoTitle } = req.body
        const file = req.files.file
        const token = req.headers['token']
        console.log(token)

        const { userId, agent } = JWT.verify( token )
        
        const users = req.readFile( 'users' )
        const videos = req.readFile( 'videos' )
        const neededUser = users.find( user  => user.userId == userId)

        if( !neededUser ) {
            return next( new AuthorizationError( 400, "This user does not exist" ) )
        }

        if( agent != req.headers['user-agent'] ) {
            return next( new AuthorizationError( 400, "Request is sent from wrong device" ) )
        }

        if( !['video/mp4', 'video/mkv', 'video/mov', 'video/wmv', 'video/avi' ].includes(file.mimetype) ) {
            return next( new AuthorizationError( 400, 'File must be video' ) )
        }

        if(file.size > 50 * 1024 * 1024) {
            return next( new AuthorizationError( 400, 'File must be less than 50MB' ) )
        }

        if( !videoTitle ) {
            return next( new AuthorizationError( 400, 'Title must be written' ) )
        }

        file.name = `${Date.now()}${file.name}`
        file.mv( path.join(process.cwd(), 'src', 'public', 'videos', file.name) )

        const newVideo = {
            videoId: videos.length ? videos.at(-1).videoId + 1 : 1,
            userId: neededUser.userId,
            videoTitle,
            videoUrl: `/videos/${file.name}`,
            videoSize: file.size,
            videoCreatedAt: Date.now()
        }

        videos.push(newVideo)
        req.writeFile( 'videos', videos )
        let neededVideos = videos.filter( video => video.userId == userId )
        res.status( 200 ).json( {status: 200, message: 'Video is added successfully', videos: neededVideos ,data: Date.now()} )
    } catch (err) {
        next( new InternalServerError( 500, err.message ) )
    }
}

module.exports = {
    POST
}