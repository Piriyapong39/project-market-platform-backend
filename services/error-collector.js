const moment = require("moment")
const fs = require("fs")
class ErrorCollector {
    constructor(){}
    collectError(error){
        const datetime = moment().format("YYYY-MM-DD HH:MM:SS")
        const errorMessage = `${datetime} ----> ${error}\n`
        fs.appendFileSync("./config/logs/error.txt", errorMessage, (error) => {
            console.log(error)
        })
    }
}

const errorCollector = new ErrorCollector()
module.exports = errorCollector