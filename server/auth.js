const jwt = require('jsonwebtoken')
const secret = 'kiuhfnuisdf9we8hafno9f8e8fuisdbFsd' // require('crypto').randomBytes(64).toString('hex')

module.exports = {
	generateAccessToken(username) {
		return jwt.sign(username, secret);
	},
	verify_jwt(token){
		return jwt.verify(token, secret)
	}
}
