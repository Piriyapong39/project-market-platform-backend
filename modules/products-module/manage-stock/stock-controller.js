const Model = require("./stock-model")
class Stock extends Model {
    constructor(){
        super();
    }
    async getProducts(req){
        try {
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
            console.log(pictureFiles)
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
            const { product_id, adj_value} = req.body
            if(!product_id || !adj_value || typeof(adj_value) !== "number"){
                throw new Error("Product ID and adj_value is required or adj_value must be number")
            }
            return await this._updateStockProduct(user_id, product_id, adj_value)
        } catch (error) {
            throw error
        }
    }
    async disableEnableProduct(req){
        try {
            let current_status = null
            let expect_status = null
            const expectStatus = req.expectStatus
            const user_id = req.user.user_id
            const { product_id } = req.body
            if(!product_id || expectStatus === undefined){
                throw new Error("Product ID and Expect status are required")
            }
            if(expectStatus === 0){
                current_status = 1
                expect_status = 0
            } else if (expectStatus === 1){
                current_status = 0
                expect_status = 1
            } else {
                throw new Error("req.expectStatus is wrong format")
            }
            return await this._disableEnableProduct(user_id, product_id, expect_status, current_status)
        } catch (error) {
            throw error
        }
    }

}

module.exports = Stock