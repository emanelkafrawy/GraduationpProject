const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        (cb(null, `uploads`)); //null y3ni no errors and uploads the name of folder which store in it
    },
    filename: (req, file, cb) => {
        cb(null,new Date().toISOString().replace(/:/g,'-') + '-' + file.originalname);
    }
});
const upload = multer({
    storage: fileStorage,
    limits: {
        fileSize: 7000000 //1 million y3ni 3mb
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(JPG|jpeg|png|jpg|PNG|JPEG)$/)) {
            return cb(new Error('please upload images only'))
        }
        cb(undefined, true); //y3ni a2bl l file
    },
});
module.exports = upload;