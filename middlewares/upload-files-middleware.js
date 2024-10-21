
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFiles = (req, res, next) => {
    const uploadHandler = upload.array('files', 5); 
    uploadHandler(req, res, (error) => {
        if (error) {
            console.log(error);
            return res.status(400).json({success: 0, error: error.message});
        }
        next();
    });
}

module.exports = uploadFiles;


