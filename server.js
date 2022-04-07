const express = require( 'express' )
const { PORT } = require( './config.js' )
const fileUpload = require( 'express-fileupload' )
const fs = require( 'fs' )
const path = require( 'path' )
const cors = require( 'cors' )
const app = express()

app.use( cors() )
app.use( express.json() )
app.use( express.static(path.join(__dirname, 'src', 'public')) )
app.use( fileUpload() )

//middlewares
const authMiddleware = require( './src/middlewares/auth.js' )
const checkToken = require( './src/middlewares/checkToken.js' )
const modelMiddleware = require( './src/middlewares/model.js' )

app.use( modelMiddleware )
app.use( [ '/addvideo', '/deletevideo', '/editname', ' /logout'], checkToken )
app.use( authMiddleware )

//router
const registerRouter = require( './src/routes/register.js' )
const loginRouter = require( './src/routes/login.js' )
const usersRouter = require( './src/routes/users.js' )
const getVideosRouter = require( './src/routes/getVideo.js' )
const addVideoRouter = require( './src/routes/addVideo.js' )
const deleteVideoRouter = require( './src/routes/deleteVideo.js' )
const editVideoNameRouter = require( './src/routes/editVideoName.js' )

app.use( registerRouter )
app.use( loginRouter )
app.use( usersRouter )
app.use( getVideosRouter )
app.use( addVideoRouter )
app.use( deleteVideoRouter )
app.use( editVideoNameRouter )


app.use( (error, req, res, next) => {
    if (error.name == 'ValidationError') {
        return res.status(error.status).json({
            status: error.status,
            message: error.message?.details?.[0]?.message || error.message,
            errorName: error.name,
            error: true,
        })
    }
    
    if (error.status != 500) {
        return res.status(error.status).json({
            status: error.status,
            message: error.message,
            errorName: error.name,
            error: true,
        })
    }
    
    fs.appendFileSync('log.txt', `${req.url}__${req.method}__${Date.now()}__${error.name}__${error.message}\n`)
    
    return res.status(error.status).json({
        status: error.status,
        message: 'Internal Server Error',
        errorName: error.name,
        error: true,
    })
})

app.listen( PORT, () => {
    console.log( `=> http://192.168.3.7:${PORT}` )
} )