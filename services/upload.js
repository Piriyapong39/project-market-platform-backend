const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")

class Upload {
    constructor(){}
    async uploadProductPic(file) {
        try {
            const extName = path.extname(file.originalname)
            const fileName = uuidv4() + extName;  
            const filePath = path.join(__dirname, "../views/files/pictures", fileName);
            if(extName !== ".png" && extName !== ".jpeg" && extName !== ".jpg"){
                throw new Error("Only png, jpeg and jpg is allow")
            }
            await fs.promises.writeFile(filePath, file.buffer);
            return filePath;
        } catch (error) {
            throw error
        }
    }
}

module.exports = Upload