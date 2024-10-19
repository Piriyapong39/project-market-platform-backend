// Dependencies
const { sequelize, QueryTypes } = require("../../../config/database")
const config = require("config")
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// ENV
const saltRounds = config.get("saltRounds")
const JWT_SECRET_KEY = config.get("JWT_SECRET_KEY")

// Services
const JwtService = require("../../../services/jwt-service")
const jwtService = new JwtService();

class Model {
    constructor(){}
    async _sellerRegister(email, password, first_name, last_name, address, is_seller){
        try {
            const sameEmail = await sequelize.query(
                `
                SELECT email
                FROM tb_mp_users
                WHERE email = :email
                `,
                {
                    replacements: {
                        email
                    },
                    type: QueryTypes.SELECT
                }
            )
            if(sameEmail.length > 0){
                throw new Error("This email is already used")
            }
            const hash = bcrypt.hashSync(password, saltRounds);
            let resulstData = await sequelize.query(
                `
                INSERT INTO tb_mp_users (email, password, first_name, last_name, address, is_seller)
                VALUES (:email, :password, :first_name, :last_name, :address, :is_seller)
                `,
                {
                    replacements: {
                        email,
                        password: hash,
                        first_name,
                        last_name,
                        address,
                        is_seller
                    },
                    type: QueryTypes.INSERT
                }
            )
            console.log(resulstData)
            const token = jwt.sign(
                {
                    user_id: resulstData[0],
                    email,
                    first_name,
                    last_name,
                    address,
                    is_seller: 1,
                    user_status: 1
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
    async _sellerLogin(email, password){
        try {

            const resultData = await sequelize.query(
                `
                SELECT 
                    user_id, email, password, first_name, last_name,
                    address, is_seller
                FROM tb_mp_users
                WHERE 1=1
                    AND email = :email
                    AND user_status != 0
                `,
                {
                    replacements: {
                        email
                    },
                    type: QueryTypes.SELECT
                }
            )
            if(resultData.length === 0){
                throw new Error("Wrong email please try again")
            }
            if(bcrypt.compareSync(password, resultData[0].password) === false){
                throw new Error("Wrong password try again")
            }
            const token = jwt.sign(
                {
                    user_id: resultData[0].user_id,
                    email: resultData[0].email,
                    first_name: resultData[0].first_name,
                    last_name: resultData[0].last_name,
                    address: resultData[0].address,
                    is_seller: resultData[0].is_seller,
                    user_status: resultData[0].user_status
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
    async _buyerToSeller(user_id, is_seller, email){
        try {
            let newToken
            const resultsData = await sequelize.query(
                `CALL sp_update_buyer_to_seller(:user_id, :is_seller)`,
                {
                    replacements: {
                        user_id,
                        is_seller
                    },
                    type: QueryTypes.UPDATE
                }
            )
            if(resultsData[0].affected_rows === 0){
                throw new Error("Something is error in buyer to seller")

            }
            newToken = await jwtService.genNewToken(user_id, email)
            return newToken
        } catch (error) {
            throw error
        }
    }
    async _isNotSellerCheck(user_id, email){
        try {
            let result = await sequelize.query(
                `CALL sp_get_user_info(:user_id, :email)`,
                {
                    replacements: {
                        user_id, 
                        email
                    },
                    type: QueryTypes.RAW
                }
            )
            if(result[0].is_seller !== 0){
                throw new Error("You are seller")
            }
            return result
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model