import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/editor', (req, res) => {
    res.render('editor', { 
        regularImage: req.query.regularImage, 
        watermarkImage: req.query.watermarkImage 
    });
});

router.post('/upload', async (req, res) => {
    try {
        const { regularImage, watermarkImage } = req.files;

        const imageDir = path.join(__dirname, '../uploads');
        const regularImagePath = path.join(imageDir, regularImage.name);
        const watermarkImagePath = path.join(imageDir, watermarkImage.name);

        await fs.mkdir(imageDir, { recursive: true });

        await regularImage.mv(regularImagePath);
        await watermarkImage.mv(watermarkImagePath);

        res.redirect(`/editor?regularImage=${regularImage.name}&watermarkImage=${watermarkImage.name}`);
    } catch (err) {
        res.status(500).send('Error uploading images');
    }
});

router.post('/export', async (req, res) => {
    const { regularImage, watermarkImage, x, y, opacity } = req.body;

    const regularImagePath = path.join(__dirname, '../uploads', regularImage);
    const watermarkImagePath = path.join(__dirname, '../uploads', watermarkImage);

    const outputImagePath = path.join(__dirname, '../exports', `exported_${Date.now()}.png`);

    try {
        await fs.mkdir(path.join(__dirname, '../exports'), { recursive: true });

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

            await fs.unlink(regularImagePath);
            await fs.unlink(watermarkImagePath);
            await fs.unlink(outputImagePath);
        });
    } catch (err) {
        res.status(500).send('Error processing images');
    }
});

export default router;
