// Dependencies
const express = require("express")
const Router = express.Router();

// Import Controller
const Buyer = require("./buyer-controller")
const buyer = new Buyer();


// Endpoints
Router.post("/register", async (req, res) => {
    try {
        return res.status(200).json({success: 1, data: await buyer.buyerRegister(req)})
    } catch (error) {
        req.errorCollector.collectError(error)
        return res.status(400).json({success: 0, error: error.message})
    }
})

Router.post("/login", async (req, res) => {
    try {
        return res.status(200).json({success: 1, data: await buyer.buyerLogin(req)})
    } catch (error) {
        req.errorCollector.collectError(error)
        return res.status(400).json({success: 0, error: error.message})
    }
})


module.exports = Router