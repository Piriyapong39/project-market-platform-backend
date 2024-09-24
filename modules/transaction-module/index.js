// Dependencies
const express = require("express")
const Router = express.Router();

// Import transaction routes
const transactionRoute = require("./transaction/index")

// Use endpoint
Router.use("/get", transactionRoute)


module.exports = Router

