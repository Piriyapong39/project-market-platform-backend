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

// Services
const errorCollector = require("./services/error-collector")
app.use((req, res, next) => {
    req.errorCollector = errorCollector
    next();
})

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

    2024-10-08
        task   
            - Create new database                   -- done
            - Create new table with same config     -- done
            - Complete buy transaction 
    
    2024-11-08
        task
            - Change sql in backend to procedure in navicat
            - Upload picture shoulnd not be middlewares because uploads done bofore insert products         -- done

*/