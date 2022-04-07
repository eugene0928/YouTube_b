const PORT = process.env.PORT || 5000
const path = require( 'path' )

const dotenv = require('dotenv')

dotenv.config({ path: path.join(process.cwd(), '.env') })

module.exports = {
    PORT
}