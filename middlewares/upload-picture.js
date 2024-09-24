const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../views/files/pictures"));
    },
    filename: function (req, file, cb) {
        const extName = path.extname(file.originalname)
        cb(null, uuidv4() + extName);
    }
});

function fileFilter (req, file, cb) {
    const extName = path.extname(file.originalname).toLowerCase()
    if(extName !== ".png" && extName !== ".jpeg" && extName !== ".jpg"){
        cb("Only png, jpeg and jpg is allow", false)
    } else {
        cb(null, true)  
    }
}

const upload = multer({storage: storage,fileFilter: fileFilter}).array('pictures', 5); 

function uploadPicture(req, res, next) {
    upload(req, res, function (error) {
        try {
            if(error){
                if(error.code === "LIMIT_UNEXPECTED_FILE"){
                    throw new Error("Pictures must less than 5")
                }
                throw new Error(error)  
            }
            next();
        } catch (error) {
            return res.status(400).json({success: 0, error: error.message})
        }
    });
}

module.exports = uploadPicture;
