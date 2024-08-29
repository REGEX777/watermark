import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs/promises';
import {v4 as uuidv4} from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// oh dear dog multer pls handle the images
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb){
        const extension = file.originalname.split('.').pop();
        const name = `${uuidv4()}.${extension}` //new name 
        cb(null, name);
    }
})
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('index');
});

router.post('/', upload.fields([{ name: 'regularImage' }, { name: 'watermarkImage' }]), async (req, res) => {
    try {
        const { regularImage, watermarkImage } = req.files;

        if (!regularImage || !watermarkImage) {
            return res.status(400).send('Both images are required');
        }

        res.redirect(`/editor?regularImage=${regularImage[0].originalname}&watermarkImage=${watermarkImage[0].originalname}`);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error uploading images');
    }
});

router.post('/export', async (req, res) => {
    const { regularImage, watermarkImage, x, y, opacity } = req.body;

    const regularImagePath = path.join(__dirname, '../public/uploads', regularImage);
    const watermarkImagePath = path.join(__dirname, '../public/uploads', watermarkImage);

    const outputImagePath = path.join(__dirname, '../public/exports', `exported_${Date.now()}.png`);

    try {
        await fs.mkdir(path.join(__dirname, '../public/exports'), { recursive: true });

        await sharp(regularImagePath)
            .composite([{
                input: watermarkImagePath, 
                top: parseInt(y), 
                left: parseInt(x),
                blend: 'overlay',
                opacity: parseFloat(opacity) || 1.0
            }])
            .toFile(outputImagePath);

        res.download(outputImagePath, async (err) => {
            if (err) {
                return res.status(500).send('Error exporting image');
            }

            // delete the images after eve
            await fs.unlink(outputImagePath);
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error processing images');
    }
});


export default router;
