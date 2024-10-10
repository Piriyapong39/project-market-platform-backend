const fs = require("fs")
class RemoveFile {
    constructor(){}
    removePic(picPathsArr){
        try {
            picPathsArr.forEach(e => {
                const nameSplit = e.split("\\")
                const picName = nameSplit[nameSplit.length - 1]
                const extName = picName.split(".")[1].toLowerCase()
                if(extName === "png" || extName === "jpeg" || extName === "jpg"){
                    fs.rm(e, {recursive: true}, (error) => { 
                        if(error){ 
                            throw new Error(error)
                        } 
                    }) 
                }else{
                    throw new Error("wrong extname to remove")
                }
            })
        } catch (error) {
            throw error
        }
    }
}

module.exports = RemoveFile