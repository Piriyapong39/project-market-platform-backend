const express = require("express")
const Router = express.Router();

// Import Routes in product-modules
const manageStockRoute = require("./manage-stock/index")
const getProductRoute = require("./get-product/index")

// Export routes
Router.use("/manage-stock", manageStockRoute)
Router.use("/get-product", getProductRoute)


module.exports = Router