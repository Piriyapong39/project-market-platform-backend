// Dependecies
const express = require("express")
const bodyParser = require("body-parser")
const config = require("config")
const cors = require("cors")
const path = require('path');
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

// Picture files
app.use('/picture-files', express.static(path.join(__dirname, 'public', 'uploads', 'product-pictures')));

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


