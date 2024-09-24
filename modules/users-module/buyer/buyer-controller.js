const Model = require("./buyer-model")
class Buyer extends Model {
    constructor(){
        super();
    }
    async buyerRegister(req){
        try {
            const is_seller = false
            const {email, password, first_name, last_name, address} = req.body
            if(!email || !password || !first_name || !last_name || !address){
                throw new Error("You are missing some fields please check again")
            }
            if(password.length < 8){
                throw new Error("Your password must more than or equal 8")
            }
            return await this._buyerRegister(email, password, first_name, last_name, address, is_seller)
        } catch (error) {
            throw error
        }
    }
    async buyerLogin(req){
        try {
            const { email, password } = req.body
            if(!email || !password){
                throw new Error("Email and Password is required")
            }
            return await this._buyerLogin(email, password)
        } catch (error) {
            throw error
        }
    }
}

module.exports = Buyer