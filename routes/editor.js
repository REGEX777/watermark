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
    const { regularImage, watermarkImage, x, y, opacity } = req.body;

    if (!regularImage || !watermarkImage || x === undefined || y === undefined) {
        return res.status(400).send('Invalid data provided');
    }

    const regularImagePath = path.join(__dirname, '../uploads', regularImage);
    const watermarkImagePath = path.join(__dirname, '../uploads', watermarkImage);
    const outputDir = path.join(__dirname, '../exports');
    const outputImagePath = path.join(outputDir, `exported_${Date.now()}.png`);

    try {
        await fs.mkdir(outputDir, { recursive: true });

        await sharp(regularImagePath)
            .composite([{
                input: watermarkImagePath,
                top: parseInt(y, 10),
                left: parseInt(x, 10),
                blend: 'overlay',
                opacity: parseFloat(opacity) || 1.0
            }])
            .toFile(outputImagePath);

        res.download(outputImagePath, async (err) => {
            if (err) {
                console.error('Error exporting image:', err);
                return res.status(500).send('Error exporting image');
            }

            try {
                // yeet the files from the system after download
                await fs.unlink(outputImagePath);
                await fs.unlink(regularImagePath);
                await fs.unlink(watermarkImagePath);
            } catch (cleanupErr) {
                console.error('Error cleaning up files:', cleanupErr);
            }
        });
    } catch (err) {
        console.error('Error processing images:', err);
        res.status(500).send('Error processing images');
    }
});

export default router;
