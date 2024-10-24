// services

function isSeller(req, res, next){
    try {
        const isSeller = req.user.is_seller
        if(isSeller === 0){
            throw new Error("You are not allow to use this function")
        }
        next();
    } catch (error) {
        req.errorCollector.collectError(error)
        return res.status(400).json({success: 0, error: error.message})
    }
}

module.exports = isSeller