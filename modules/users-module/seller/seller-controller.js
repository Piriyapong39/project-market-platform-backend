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
    async buyerToSeller(req){
        try {
            if(!req.user){
                throw new Error("Your important data is missing")
            }
            const { user_id, is_seller, email } = req.user
            if(is_seller !== 0){
                throw new Error("You are already seller")
            }
            return await this._buyerToSeller(user_id, is_seller, email)
        } catch (error) {
            throw error
        }
    }
    async isNotSellerCheck(req){
        try {
            const { user_id, email } = req.user
            return await this._isNotSellerCheck(user_id, email)
        } catch (error) {
            throw error
        }
    }
}

module.exports = Seller