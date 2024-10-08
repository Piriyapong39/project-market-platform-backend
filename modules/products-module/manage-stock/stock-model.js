const { sequelize, QueryTypes } = require("../../../config/database")
const GenerateId = require("../../../services/generate-id")
const generateId = new GenerateId();
class Model {
    constructor(){}
    async _getProducts(user_id){
        try {
            const resultsProduct = await sequelize.query(
                `
                SELECT 
                    product_id, product_name,
                    product_desc, product_price, 
                    product_stock, category_name
                FROM 
                    vw_get_product_seller
                WHERE 1=1
                    AND user_id = :user_id
                `,
                {
                    replacements: {
                        user_id
                    },
                    type: QueryTypes.SELECT
                }
            )
            const resultsData = []
            for(let i=0; i<resultsProduct.length; i++){
                const picsPath = await sequelize.query(`CALL sp_get_pic_path('${resultsProduct[i].product_id}')`)
                const picsPathArr = picsPath.map((element) => element.pic_path)
                resultsProduct[i].pic_path = picsPathArr
                resultsData.push(resultsProduct[i])
            }

            return resultsData
        } catch (error) {
            throw error
        }
    }
    async _insertProduct(product_name, product_desc, product_stock, product_price, category_id, user_id, pic_files){
        try {
            const product_id = await generateId.getProductId()
            let resultInsertItem = await sequelize.query(
                `
                INSERT INTO tb_mp_products (product_id, product_name, product_desc, product_stock, product_price, category_id, user_id)
                VALUES ( :product_id, :product_name, :product_desc, :product_stock, :product_price, :category_id, :user_id)
                `,
                {
                    replacements: {
                        product_id,
                        product_name, 
                        product_desc, 
                        product_stock, 
                        product_price, 
                        category_id,
                        user_id
                    },
                    type: QueryTypes.INSERT
                }
            )
            for(let i=0; i<pic_files.length; i++){
                await sequelize.query(
                    `
                    INSERT INTO tb_mp_products_picture (pic_path, product_id)
                    VALUES (:pic_path, :product_id)                   
                    `,
                    {
                        replacements: {
                            pic_path: pic_files[i].path,
                            product_id: product_id
                        }
                    }
                )
            }
            resultInsertItem[1] === 1 ? resultInsertItem = "Insert item successfully" : resultInsertItem = resultInsertItem
            return resultInsertItem
        } catch (error) {
            throw error
        }
    }
    async _deleteProduct(user_id, product_id){
        try {
            let resultDelItem = await sequelize.query(
                `
                DELETE 
                FROM tb_mp_products
                WHERE 1=1
                    AND user_id = :user_id
                    AND product_id = :product_id
                `,
                {
                    replacements: {
                        user_id,
                        product_id
                    },
                    type: QueryTypes.BULKDELETE
                }
            )
            let resultDelPic = await sequelize.query(
                `
                DELETE 
                FROM tb_mp_products_picture
                WHERE 1=1
                    AND product_id = :product_id
                `,
                {
                    replacements: {
                        user_id,
                        product_id
                    },
                    type: QueryTypes.BULKDELETE
                }
            )
            resultDelItem === 0 ? resultDelItem = "Item is not found": resultDelItem = `${resultDelItem} deleted`
            resultDelPic === 0 ? resultDelPic = "Pictures are not found": resultDelPic = `${resultDelPic} deleted`            
            return {resultItem: resultDelItem, resultPictures: resultDelPic}
        } catch (error) {
            throw error
        }

    }
    async _updateStockProduct(user_id, product_id, value){
        try {
            await sequelize.query(
                `CALL sp_update_stock(:user_id, :product_id, :value, @result)`,
                {
                    replacements: {
                        user_id,
                        product_id,
                        value
                    },
                    type: QueryTypes.UPDATE
                }
            )
            let resultData = await sequelize.query(
                `
                SELECT @result AS result
                `,
                {
                    type: QueryTypes.SELECT
                }
            )
            Number(resultData[0].result) === -1 ? resultData = "Products in stock is not enough": resultData = Number(resultData[0].result)
            return resultData
        } catch (error) {
            throw error
        }
    }
    async _disableEnableProduct(user_id, product_id, expect_status, current_status){
        try {
            const resultsData = await sequelize.query(
                `
                UPDATE tb_products
                SET product_status = :expect_status
                WHERE 1=1
                    AND product_status = :current_status
                    AND user_id = :user_id                    
                    AND product_id = :product_id
                `,
                {
                    replacements: {
                        expect_status,
                        current_status,
                        user_id,
                        product_id
                    },
                    type: QueryTypes.RAW
                }
            )
            return resultsData[0].info
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model


