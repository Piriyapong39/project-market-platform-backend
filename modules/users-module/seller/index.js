const express = require("express")
const Router = express.Router();
const Seller = require("./seller-controller")
const seller = new Seller();

Router.post("/register", async (req, res) => {
    try {
        return res.status(201).json({success: 1, data: await seller.sellerRegister(req)})
    } catch (error) {
        req.errorCollector.collectError(error)
        return res.status(400).json({succes: 0, error: error.message})
    }
})

Router.post("/login", async (req, res) => {
    try {
        return res.status(200).json({success: 1, data: await seller.sellerLogin(req)})
    } catch (error) {
        req.errorCollector.collectError(error)
        return res.status(400).json({succes: 0, error: error.message})
    }
})


module.exports = Router