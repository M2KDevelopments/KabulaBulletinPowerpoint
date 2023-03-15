const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback, err) => {
        if (err) console.error(err);
        console.log('Saving File to ', path.join(__dirname, 'api/public'));
        callback(null, path.join(__dirname, '../public'))
    },
    filename: (req, file, callback, err) => {
        if (err) console.error(err);
        console.log(`${file.originalname} upload extension file`);
        const name = `${file.originalname}`
        req.storedfilename = name;
        callback(null, name);
    },
})

exports.upload = multer({ storage: storage });

