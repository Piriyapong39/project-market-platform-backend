// Dependencies
const express = require("express")
const Router = express.Router();

// Controller
const Stock = require("./stock-controller")
const stock = new Stock();

// Middlewares
const authentication = require("../../../middlewares/authentication")
const isSeller = require("../../../middlewares/is-seller")
const uploadPic = require("../../../middlewares/upload-picture")

// Routes
Router.get("/get-product", authentication, isSeller, async (req, res) => {
    try {
        return res.status(200).json({success: 1, data: await stock.getProducts(req)})
    } catch (error) {
        return res.status(400).json({success: 0, error: error.message})
    }
})

Router.post("/insert-product", authentication, isSeller, uploadPic, async (req, res) => {
    try {
        return res.status(201).json({success: 1, data: await stock.insertProduct(req)})
    } catch (error) {
        return res.status(400).json({success: 0, error: error.message})
    }
})
Router.post("/delete-product", authentication, isSeller, async (req, res) => {
    try {
        return res.status(200).json({success: 1, data: await stock.deleteProduct(req)})
    } catch (error) {
        return res.status(200).json({success: 0, error: error.message})
    }
})
Router.post("/update-stock-product", authentication, isSeller, async (req, res) => {
    try {
        return res.status(200).json({success: 1, data: await stock.updateStockProduct(req)})
    } catch (error) {
        return res.status(400).json({success: 0, error: error.message})
    }
})
Router.post("/disable-product", authentication, isSeller, async (req, res) => {
    try {
        req.body.expect_status = 0
        req.body.current_status = 1
        return res.status(200).json({success: 1, data: await stock.disableEnableProduct(req)})
    } catch (error) {
        return res.status(400).json({success: 0, error: error.message})
    }
})
Router.post("/enable-product", authentication, isSeller, async (req, res) => {
    try {
        req.body.expect_status = 1
        req.body.current_status = 0
        return res.status(200).json({success: 1, data: await stock.disableEnableProduct(req)})
    } catch (error) {
        return res.status(400).json({success: 0, error: error.message})
    }
})


module.exports = Router