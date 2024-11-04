import multer from 'multer';
import path from 'path';
import fs from 'fs';

const imageDirectory = path.join('public', 'images');

// Ensure the directory exists
if (!fs.existsSync(imageDirectory)) {
    fs.mkdirSync(imageDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });
export { upload };
