import jwt from 'jsonwebtoken'
const secret = 'kiuhfnuisdf9we8hafno9f8e8fuisdbFsd' // require('crypto').randomBytes(64).toString('hex')

type UserRequest = { name:string, pin:string }
async function generateAccessToken( user:UserRequest ){
    return jwt.sign(user, secret);
}

async function verify_jwt( token:string ){
    return jwt.verify(token, secret)
}

export { generateAccessToken, verify_jwt }
