// Dependencies
const jwt = require('jsonwebtoken');
const config = require("config")
const { sequelize, QueryTypes } = require("../config/database")

// ENV
const JWT_SECRET_KEY = config.get("JWT_SECRET_KEY")

class JwtService {
    constructor(){
    }
    async genNewToken (user_id, email){
        try {
            const resulstData = await sequelize.query(
                'CALL sp_get_user_info(:user_id, :email)',
                {
                    replacements: {
                        user_id,
                        email
                    },
                    type: QueryTypes.RAW                
                }
            )
            const token = jwt.sign(
                {
                    user_id: resulstData[0].user_id,
                    email: resulstData[0].email,
                    first_name: resulstData[0].first_name,
                    last_name: resulstData[0].last_name,
                    address: resulstData[0].address,
                    is_seller: resulstData[0].is_seller
                },
                    JWT_SECRET_KEY,    
                { 
                    expiresIn: '3h' 
                }
            );
            return token
        } catch (error) {
            throw error
        }
    }

}

module.exports = JwtService