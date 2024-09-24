// Dependencies
const express = require("express")
const Router = express.Router();

// Import Controller 
const Transaction = require("./transaction-controller")
const transaction = new Transaction();

Router.post("/reserve", async (req, res) => {
    try {
        return res.status(200).json({success: 1, data: await transaction.reserveTransaction(req)})
    } catch (error) {
        return res.status(400).json({success: 0, error: error.message})
    }
})

module.exports = Router

