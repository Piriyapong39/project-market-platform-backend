const fs = require("fs")
class RemoveFile {
    constructor(){}
    removePic(picPathsArr){
        try {
            const nameSplit = picPathsArr[0].split("\\")
            const picName = nameSplit[nameSplit.length-1]
            const extName = picName.split(".")[1]
            if(extName === "png" || extName === "jpeg" || extName === "jpg"){
                picPathsArr.forEach(e => {
                    fs.rm(e, {recursive: true}, (error) => { 
                        if(error){ 
                            throw new Error(error)
                        } 
                    }) 
                })
            } else {
                throw new Error("Wrong extname to remove")
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = RemoveFile