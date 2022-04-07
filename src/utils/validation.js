const Joi = require( 'joi' )

const schema = Joi.object( {
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{4,}$')),

} ) 
    .with('username', 'password')

process.Joi = {
    schema
}