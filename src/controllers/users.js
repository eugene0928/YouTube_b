const { InternalServerError } = require( '../utils/error.js' )
const JWT = require( '../utils/jwt.js' )
const path = require( 'path' )

const GET = ( req, res, next ) => {
    try {
        let data = req.readFile( 'users' )
       res.status( 200 ).json( data )
    } catch (err) {
        next( new InternalServerError( 500, err.message ) )
    }
}

module.exports = {
    GET
}