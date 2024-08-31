import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { requireLogin } from '../middleware/requireLogin.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const extension = file.originalname.split('.').pop();
        const name = `${uuidv4()}.${extension}`; // generate a new name using uuid
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.get('/', requireLogin, (req, res)=>{
    res.render('index')
})


// upload route
router.post('/', requireLogin, upload.fields([{ name: 'regularImage' }, { name: 'watermarkImage' }]), async (req, res) => {
    try {
        const { regularImage, watermarkImage } = req.files;

        if (!regularImage || !watermarkImage) {
            return res.status(400).send('Both images are required');
        }

        const regularImageName = regularImage[0].filename;
        const watermarkImageName = watermarkImage[0].filename;

        res.redirect(`/editor?regularImage=${regularImageName}&watermarkImage=${watermarkImageName}`);
    } catch (err) {
        console.error('Error uploading images:', err);
        res.status(500).send('Error uploading images');
    }
});

export default router;