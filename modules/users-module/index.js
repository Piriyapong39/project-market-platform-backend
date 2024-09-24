const express = require("express")
const Router = express.Router()


// Import all user routes
const sellerRoute = require("./seller/index")
const buyerRoute = require("./buyer/index")

// Use Routes
Router.use("/sellers", sellerRoute)
Router.use("/buyers", buyerRoute)

module.exports = Router