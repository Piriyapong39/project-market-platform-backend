// dependencies
const { sequelize, QueryTypes } = require("../../../config/database")
const fs = require("fs")

// services
const GenerateId = require("../../../services/generate-id")
const generateId = new GenerateId();
const Upload = require("../../../services/upload")
const upload = new Upload();

class Model {
    constructor(){}
    async _getProducts(user_id){
        try {
            const resultsProduct = await sequelize.query(
                `CALL sp_get_products_seller(:user_id)`,
                {
                    replacements: {
                        user_id
                    },
                    type: QueryTypes.RAW
                }
            )
            const resultsData = resultsProduct.map( e => {
                e.pic_paths = e.pic_paths.split(";")
                return e
            })
            return resultsData
        } catch (error) {
            throw error
        }
    }
    async _insertProduct(product_name, product_desc, product_stock, product_price, category_id, user_id, pictureFiles){
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
            const picturePaths = await Promise.all(pictureFiles.map(file => {
                return upload.uploadProductPic(file);
            }))
            let resultUploadPic = ""
            picturePaths.length !== 0 ? resultUploadPic = "Upload Pictures successfully" : resultUploadPic = "No picture uploaded"
            for (const pic_path of picturePaths) {
                await sequelize.query(
                    `
                    INSERT INTO tb_mp_products_picture (pic_path, product_id)
                    VALUES (:pic_path, :product_id)                   
                    `,
                    {
                        replacements: {
                            pic_path,
                            product_id
                        },
                        type: QueryTypes.INSERT
                    }
                );
            }
            resultInsertItem[1] === 1 ? resultInsertItem = "Insert item successfully" : resultInsertItem = resultInsertItem
            return { product: resultInsertItem, picture: resultUploadPic}
        } catch (error) {
            throw error
        }
    }
    async _deleteProduct(user_id, product_id){
        try {
            // delete product and pictures in database
            let resultsData = await sequelize.query(
                'CALL sp_delete_product(:user_id , :product_id)',
                {
                    replacements: {
                        user_id,
                        product_id
                    },
                    type: QueryTypes.DELETE
                }
            )
            // delete pictures files in storage
            if(resultsData[0].pic_paths === null || resultsData[0].product_affected === 0){
                resultsData = "Product not found"
            }else{
                const picsPathArr = resultsData[0].pic_paths.split(",")
                picsPathArr.forEach(e => {
                    fs.rm(e, {recursive: true}, (error) => { 
                        if(error){ 
                            throw new Error(error)
                        } 
                    }) 
                })
            }
            return resultsData
        } catch (error) {
            throw error
        }
    }
    async _updateStockProduct(user_id, product_id, adj_value){
        try {
            let resultData = await sequelize.query(
                `CALL sp_update_stocks(:user_id, :product_id, :adj_value)`,
                {
                    replacements: {
                        user_id,
                        product_id,
                        adj_value
                    },
                    type: QueryTypes.UPDATE
                }
            )
            // 1 => update stock success , -1 => update stock fail
            if(resultData[0].result === -1){
                throw new Error("Not enough products in stock to decrease")
            }
            resultData = "Update stock successfully"
            return resultData
        } catch (error) {
            throw error
        }
    }
    async _disableEnableProduct(user_id, product_id, expect_status, current_status){
        try {
            let resultsData = await sequelize.query(
                `CALL sp_disable_or_enable_product(:user_id, :product_id, :expect_status, :current_status)`,
                {
                    replacements: {
                        user_id, 
                        product_id, 
                        expect_status, 
                        current_status
                    },
                    type: QueryTypes.UPDATE
                }
            )
            // resultData means affected_row
            if(resultsData[0].affected_rows === 0){
                throw new Error("Not found product to disable or enable")
            }
            return resultsData
        } catch (error) {
            throw error
        }
    }
}

module.exports = Model


