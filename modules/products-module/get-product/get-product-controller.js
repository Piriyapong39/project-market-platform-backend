const Model = require("./get-product-model")
class Product extends Model {
    constructor(){
        super();
    }
    async getProduct(){
        try {
            return await this._getProduct()
        } catch (error) {
            throw error
        }
    }
}

module.exports = Product