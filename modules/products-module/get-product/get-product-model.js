// Dependencies

// Import Database
const { sequelize, QueryTypes } = require("../../../config/database")

class Model {
    constructor(){}
    async _getProduct(){
        try {
            const resultsData = await sequelize.query(
                `
                SELECT * 
                FROM vw_get_product_seller
                LIMIT 10
                `,
                {
                    type: QueryTypes.SELECT
                }
            )
            const resultsDataAndPic = []
            for(let i=0; i<resultsData.length; i++){
                const productIdArr = []
                resultsData.forEach(e => productIdArr.push(e.product_id))
                const picsPath = await sequelize.query(`CALL sp_get_pic_path('${productIdArr[i]}')`)
                const picsPathMap = picsPath.map( element => element.pic_path)
                resultsData[i].pic_path = picsPathMap
                resultsDataAndPic.push(resultsData[i])
            }
            return resultsDataAndPic
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model
