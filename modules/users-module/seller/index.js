const express = require("express")
const Router = express.Router();
const Seller = require("./seller-controller")
const seller = new Seller();

// Middlewares
const authentication = require("../../../middlewares/authentication")
const isNotSeller = require("../../../middlewares/is-not-seller")


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

Router.post("/is-not-seller", authentication, isNotSeller, (req, res)=>{
    try {
        console.log(1)
        res.status(200).json({success:1, data: "You are allow to use this"})
    } catch (error) {
        res.status(400).json({succes: 0, error: error.message})
    }
})

Router.post("/to-seller", authentication, async (req, res)=>{
    try {
        res.status(200).json({success: 1, data: await seller.buyerToSeller(req)})
    } catch (error) {
        req.errorCollector.collectError(error)
        res.status(400).json({success: 0, error: error.message})
    }
})

module.exports = Router