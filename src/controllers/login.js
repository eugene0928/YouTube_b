const { AuthorizationError, ValidationError, InternalServerError } = require( '../utils/error.js' )
const JWT = require( '../utils/jwt.js' )
const path = require( 'path' )
const sha256 = require( 'sha256' )

const POST = ( req, res, next ) => {
    try {
        let { username, password } = req.body
        let users = req.readFile('users')

        let neededUser = users.find( user => user.username == username && user.password == sha256(password))
        console.log(req.body)
        if( !neededUser ) {
            return next( new AuthorizationError(400, "Wrong username or password") )
        } 

        const agent = req.headers['user-agent']

        res.status( 200 ).json( {
            status: 200,
            id: neededUser.userId,
            token: JWT.sign( {userId: neededUser.userId, agent}, process.env.JWT_SECRET_KEY ),
            message: 'User successfully logged in'
        } )
    } catch (err) {
        next( new InternalServerError( 500, err.message ) )
    }
}

module.exports = {
    POST
}