const { sequelize, QueryTypes } = require("../config/database")
const moment = require("moment")
class GenerateId {
    constructor(){}
    async getProductId(){
        try {
            const resultData = await sequelize.query(
                `
                SELECT id
                FROM tb_mp_products
                ORDER BY id DESC
                LIMIT 1
                `,
                {
                    type: QueryTypes.SELECT
                }
            )
            let product_id = ""
            if(resultData.length === 0){
                product_id = `P${moment().format('YYYYMMDD')}1`
            } else {
                product_id = `P${moment().format('YYYYMMDD')}${Number(resultData[0].id)+1}`
            }

            return product_id
        } catch (error) {
            throw error
        }
    }
}

module.exports = GenerateId