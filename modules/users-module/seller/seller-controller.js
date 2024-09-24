const Model = require("./seller-model")
class Seller extends Model {
    constructor(){
        super();
    }
    async sellerRegister(req){
        try {
            const { email, password, first_name, last_name, address } = req.body
            if(!email || !password || !first_name || !last_name || !address){
                throw new Error("You are missing some fields please check again")
            }
            if(password.length < 8){
                throw new Error("You password must more than 8 characters")
            }
            const is_seller = true
            return await this._sellerRegister(email, password, first_name, last_name, address, is_seller)
        } catch (error) {
            throw error
        }
    }
    async sellerLogin(req){
        try {
            const { email, password} = req.body
            if(!email || !password){
                throw new Error("You are missing Email or Password please check again")
            }
            return await this._sellerLogin(email, password)
        } catch (error) {
            throw error
        }
    }
}

module.exports = Seller