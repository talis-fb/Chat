import jwt from 'jsonwebtoken'
const secret = 'kiuhfnuisdf9we8hafno9f8e8fuisdbFsd' // require('crypto').randomBytes(64).toString('hex')

function generateAccessToken( username:{ name: string, pin:string } ){
    return jwt.sign(username, secret);
}

function verify_jwt( token:string ){
    return jwt.verify(token, secret)
}

export { generateAccessToken, verify_jwt }
