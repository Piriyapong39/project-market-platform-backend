const config = require("config")
const JWT_SECRET_KEY = config.get("JWT_SECRET_KEY")
var jwt = require('jsonwebtoken');
function authentication(req, res, next){
    try {
        const token = req.headers.authorization
        console.log(token)
        if(!token){
            throw new Error("Missing token or invalid token format")
        }
        var decoded = jwt.verify(token.split(" ")[1], JWT_SECRET_KEY)
        req.user = {
            user_id: decoded.user_id,
            email: decoded.email,
            first_name: decoded.first_name,
            last_name: decoded.last_name,
            address: decoded.address,
            is_seller: decoded.is_seller
        }
        next();
    } catch (error) {
        return res.status(400).json({success: 0, error: error.message})
    }
}

module.exports = authentication