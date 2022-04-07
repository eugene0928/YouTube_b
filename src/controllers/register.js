const { AuthorizationError, ValidationError, InternalServerError } = require( '../utils/error.js' )
const JWT = require( '../utils/jwt.js' )
const sha256 = require( 'sha256' )
const path = require( 'path' )

const POST = ( req, res, next ) => {
    try {
        let { username, password } = req.body
        let file = req.files.file
        let users = req.readFile('users')

        let neededUser = users.find( user => user.username == username )
        if(neededUser) {
            return next( new AuthorizationError(400, "This user already exists") )
        } 

        if( !['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype) ) {
            return next( new ValidationError( 400, "File must be image" ) )
        }

        if(file.size > 5 * 1024 * 1024) {
            return next( new ValidationError( 400, "File must be smaller than 50MB" ) )
        }

        file.name = `${Date.now()}${file.name}`
        file.mv(path.join(process.cwd(), 'src', 'public','images', file.name))

        const newUser = {
            userId: users.length ? users.at(-1).userId + 1 : 1,
            username,
            profileImg: `/images/${file.name}`,
            password: sha256(password),
            userCreatedAt: Date.now()
        }

        const agent = req.headers['user-agent']

        users.push( newUser )
        req.writeFile( 'users', users )

        res.status( 200 ).json( {
            status: 200,
            id: newUser.userId,
            token: JWT.sign( {userId: newUser.userId, agent}, process.env.JWT_SECRET_KEY ),
            message: 'User successfully joined'
        } )
    } catch (err) {
        next( new InternalServerError( 500, err.message ) )
    }
}

module.exports = {
    POST
}