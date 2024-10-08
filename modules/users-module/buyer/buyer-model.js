// Dependecies
const bcrypt = require('bcrypt');
const config = require("config")
var jwt = require('jsonwebtoken');


// ENV
const saltRounds = config.get("saltRounds")
const JWT_SECRET_KEY = config.get("JWT_SECRET_KEY")

// Import Database
const { sequelize, QueryTypes } = require("../../../config/database")

class Model {
    constructor(){}
    async _buyerRegister(email, password, first_name, last_name, address, is_seller){
        try {
            const sameEmail = await sequelize.query(
                `
                SELECT email
                FROM tb_mp_users
                WHERE 1=1
                    AND email = :email
                `,
                {
                    replacements: {
                        email
                    },
                    type: QueryTypes.SELECT
                }
            )
            if(sameEmail.length !== 0){
                throw new Error("This email already used")
            }
            const hash = bcrypt.hashSync(password, saltRounds);
            let resultsData = await sequelize.query(
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
                    }
                }
            )
            resultsData[1] === 1 ? resultsData = "Register successfully" : resultsData = resultsData
            return resultsData  
        } catch (error) {
            throw error
        }
    }
    async _buyerLogin(email, password){
        try {
            const resultData = await sequelize.query(
                `
                SELECT *
                FROM tb_mp_users
                WHERE 1=1
                    AND user_status = 1
                    AND email = :email
                `,
                {
                    replacements: {
                        email
                    },
                    type: QueryTypes.SELECT
                }
            )
            if(resultData.length === 0){
                throw new Error("Wrong Email try again")
            }
            if(bcrypt.compareSync(password, resultData[0].password) === false){
                throw new Error("Wrong Password try again")
            }
            var token = jwt.sign(
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
}

module.exports = Model
