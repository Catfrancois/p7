const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(null, `${name}_${Date.now()}.${extension}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, callback) => {
        if (MIME_TYPES[file.mimetype]) {
            callback(null, true);
        } else {
            callback(new Error('Invalid file type! Only JPG, JPEG, and PNG are allowed'), false);
        }
    },
}).single('image');

const optimizeImage = async (req, res, next) => {
    if (!req.file) return next();

    const filePath = path.normalize(`images/${req.file.filename}`);
    const tempFilePath = `${filePath}.tmp`;

    try {
        const readStream = fs.createReadStream(filePath);
        const writeStream = fs.createWriteStream(tempFilePath);

        readStream
            .pipe(
                sharp()
                    .resize(800)
                    .jpeg({ quality: 80 })
            )
            .pipe(writeStream);

        writeStream.on('finish', async () => {
            await fs.promises.rename(tempFilePath, filePath);
            next();
        });

        writeStream.on('error', () => {
            res.status(500).json({ error: 'Image optimization failed' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Image optimization failed' });
    }
};

module.exports = { upload, optimizeImage };
