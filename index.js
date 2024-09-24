// Dependecies
const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const app = express()
app.use(bodyParser.json())

// ENV
const PORT = config.get("PORT")

// Middlewares
const authentication = require("./middlewares/authentication")

// Import routes
const usersRoute = require("./modules/users-module/index")
const productsRoute = require("./modules/products-module/index")
const transactionRoute = require("./modules/transaction-module/index")

// Import class
const Product = require("./modules/products-module/get-product/get-product-controller")
const product = new Product();

// All Route
app.get("/", async (req, res) => {
    try {
        return res.status(200).json({success: 1, data: await product.getProduct()})
    } catch (error) {
        return res.status(400).json({success: 0, error: error.message})
    }
})
app.use("/users", usersRoute)
app.use("/products", productsRoute)
app.use("/transaction", authentication, transactionRoute)

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})


/*

        Job for today





        knowledge
        if you want to loop inside loop use => for(let i=0; i<xxx.length; i++)
        don't use forEach cause it have to many resolve and reject cases and you must use promise all in function

*/