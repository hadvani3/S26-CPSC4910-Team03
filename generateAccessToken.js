const jwt = require("jsonwebtoken")
function generateAccessToken (user) {
return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
}
function decodeAccessToken (token) {
    try {
        const decodedPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return decodedPayload.user
    }
    catch {
        console.error("Token Verification Failed")
    }
}
module.exports= { generateAccessToken, decodeAccessToken }
