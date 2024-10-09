// Dependencies
const express = require("express")
const Router = express.Router();

// Import Controller
const Product = require("./get-product-controller")
const product = new Product();

Router.get("/product", async (req, res) => {
    try {
        return res.status(200).json({success: 1, data: await product.getProduct()})
    } catch (error) {
        req.errorCollector.collectError(error)
        return res.status(400).json({success: 0, error: error.message})
    }
})

module.exports = Router