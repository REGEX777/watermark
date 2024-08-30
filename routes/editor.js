import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
    const { regularImage, watermarkImage } = req.query;

    if (!regularImage || !watermarkImage) {
        return res.status(400).send('Images not provided');
    }

    res.render('editor', {
        regularImage,
        watermarkImage
    });
});

router.post('/upload', async (req, res) => {
    try {
        const { regularImage, watermarkImage } = req.files;

        if (!regularImage || !watermarkImage) {
            return res.status(400).send('Both images are required');
        }

        const imageDir = path.join(__dirname, '../uploads');
        const regularImagePath = path.join(imageDir, regularImage.name);
        const watermarkImagePath = path.join(imageDir, watermarkImage.name);

        await fs.mkdir(imageDir, { recursive: true });

        await Promise.all([
            regularImage.mv(regularImagePath),
            watermarkImage.mv(watermarkImagePath)
        ]);

        res.redirect(`/editor?regularImage=${regularImage.name}&watermarkImage=${watermarkImage.name}`);
    } catch (err) {
        console.error('Error uploading images:', err);
        res.status(500).send('Error uploading images');
    }
});

router.post('/export', async (req, res) => {
    const { regularImage, watermarkImage, position, opacity, size } = req.body;

    const regularImagePath = path.join(__dirname, '..', 'public', 'uploads', regularImage);
    const watermarkImagePath = path.join(__dirname, '..', 'public', 'uploads', watermarkImage);
    const outputImagePath = path.join(__dirname, '..', 'public', 'uploads', `output-${Date.now()}.png`);

    try {
        const { width: regularWidth, height: regularHeight } = await sharp(regularImagePath).metadata();

        const watermarkBuffer = await sharp(watermarkImagePath)
            .resize({
                width: Math.min(parseInt(size * 1.5), regularWidth), 
                height: Math.min(parseInt(size * 1.5), regularHeight) 
            })
            .png()
            .toBuffer();

        const { width: watermarkWidth, height: watermarkHeight } = await sharp(watermarkBuffer).metadata();

        let left = 0;
        let top = 0;
        const margin = 10; 

        switch (position) {
            case 'top-left':
                left = margin;
                top = margin;
                break;
            case 'top-right':
                left = regularWidth - watermarkWidth - margin;
                top = margin;
                break;
            case 'bottom-left':
                left = margin;
                top = regularHeight - watermarkHeight - margin;
                break;
            case 'bottom-right':
                left = regularWidth - watermarkWidth - margin;
                top = regularHeight - watermarkHeight - margin;
                break;
            case 'center':
                left = Math.round((regularWidth - watermarkWidth) / 2);
                top = Math.round((regularHeight - watermarkHeight) / 2);
                break;
        }

        await sharp(regularImagePath)
            .composite([{
                input: watermarkBuffer,
                top: top,
                left: left,
                blend: 'over',
                opacity: parseFloat(opacity) / 100
            }])
            .toFile(outputImagePath);

        res.download(outputImagePath);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing the image.');
    }
});


export default router;
