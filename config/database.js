const { Sequelize, QueryTypes } = require('sequelize');
const fs = require("fs")
const moment = require("moment")
const sequelize = new Sequelize('market_platform', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    hooks: {
        afterQuery: (option, query)=> {
            const datetime = moment().format()
            const logSQL = `${datetime} ${query.sql}\n`
            fs.appendFile("./config/logs/sql.txt", logSQL, (error)=>{
                if(error){
                    throw new Error(error)
                }
            })
        }
    }
});

module.exports = { sequelize, QueryTypes}