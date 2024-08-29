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

        await regularImage.mv(regularImagePath);
        await watermarkImage.mv(watermarkImagePath);

        res.redirect(`/editor?regularImage=${regularImage.name}&watermarkImage=${watermarkImage.name}`);
    } catch (err) {
        console.error('Error uploading images:', err);
        res.status(500).send('Error uploading images');
    }
});

router.post('/export', async (req, res) => {
    const { regularImage, watermarkImage, position } = req.body;

    if (!regularImage || !watermarkImage || !position) {
        return res.status(400).send('invalid data provided');
    }

    const regularImagePath = path.join(__dirname, '../uploads', regularImage);
    const watermarkImagePath = path.join(__dirname, '../uploads', watermarkImage);
    const outputDir = path.join(__dirname, '../exports');
    const outputImagePath = path.join(outputDir, `exported_${Date.now()}.png`);

    let top, left;
    switch (position) {
        case 'top-left':
            top = 0;
            left = 0;
            break;
        case 'top-right':
            top = 0;
            left = await getImageWidth(regularImagePath) - await getImageWidth(watermarkImagePath);
            break;
        case 'bottom-left':
            top = await getImageHeight(regularImagePath) - await getImageHeight(watermarkImagePath);
            left = 0;
            break;
        case 'bottom-right':
            top = await getImageHeight(regularImagePath) - await getImageHeight(watermarkImagePath);
            left = await getImageWidth(regularImagePath) - await getImageWidth(watermarkImagePath);
            break;
    }

    try {
        await fs.mkdir(outputDir, { recursive: true });

        await sharp(regularImagePath)
            .composite([{
                input: watermarkImagePath,
                top: parseInt(top, 10),
                left: parseInt(left, 10),
                blend: 'overlay',
                opacity: 0.75
            }])
            .toFile(outputImagePath);

        res.download(outputImagePath, async (err) => {
            if (err) {
                console.error('error exporting image:', err);
                return res.status(500).send('error exporting image');
            }

            try { //yeet the files out of the machine
                await fs.unlink(outputImagePath);
                await fs.unlink(regularImagePath);
                await fs.unlink(watermarkImagePath);
            } catch (cleanupErr) {
                console.error('error cleaning up files:', cleanupErr);
            }
        });
    } catch (err) {
        console.error('image processing error', err);
        res.status(500).send('image processing error');
    }
});

async function getImageWidth(imagePath) {
    const { width } = await sharp(imagePath).metadata();
    return width;
}

async function getImageHeight(imagePath) {
    const { height } = await sharp(imagePath).metadata();
    return height;
}


export default router;
