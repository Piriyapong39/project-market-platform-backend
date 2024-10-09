const Model = require("./stock-model")
class Stock extends Model {
    constructor(){
        super();
    }
    async getProducts(req){
        try {
            /*
                Next time add more parameter but now it's just all seller's products 
            */
           const user_id = req.user.user_id
           if(!user_id){
                throw new Error("User ID is required")
           }
            return this._getProducts(user_id)
        } catch (error) {
            throw error
        }
    }
    async insertProduct(req){
        try {
            const user_id = req.user.user_id
            const pictureFiles = req.files
            const { product_name, product_desc, product_stock, product_price, category_id} = req.body
            if(!product_name || !product_desc || !product_stock || !product_price || !category_id){
                throw new Error("You are missing some data please insert all data")
            }
            if(Number(product_stock)<= 0 || Number(product_price) <= 0){
                throw new Error("Price and Stock must more than 0 ")
            }
            return await this._insertProduct(product_name, product_desc, product_stock, product_price, category_id, user_id, pictureFiles)
        } catch (error) {
            throw error
        }
    }
    async deleteProduct(req){
        try {
            const user_id = req.user.user_id
            const product_id = req.body.product_id
            if(!product_id){
                throw new Error("Product ID is required")
            }
            return await this._deleteProduct(user_id, product_id)
        } catch (error) {
            throw error
        }
    }
    async updateStockProduct(req){
        try {
            const user_id = req.user.user_id
            const { product_id, value} = req.body
            if(!product_id || !value){
                throw new Error("Product ID and Value is required")
            }
            return await this._updateStockProduct(user_id, product_id, value)
        } catch (error) {
            throw error
        }
    }
    async disableEnableProduct(req){
        try {
            const user_id = req.user.user_id
            const {product_id, expect_status, current_status} = req.body
            if(!product_id){
                throw new Error("Product ID is required")
            }
            return await this._disableEnableProduct(user_id, product_id, expect_status, current_status)
        } catch (error) {
            throw error
        }
    }

}

module.exports = Stock