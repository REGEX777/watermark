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
    const { regularImage, watermarkImage, position, opacity } = req.body;

    if (!regularImage || !watermarkImage || !position || opacity === undefined) {
        return res.status(400).send('Invalid data provided');
    }

    const regularImagePath = path.join(__dirname, '../public/uploads', regularImage);
    const watermarkImagePath = path.join(__dirname, '../public/uploads', watermarkImage);
    const outputDir = path.join(__dirname, '../exports');
    const outputImagePath = path.join(outputDir, `exported_${Date.now()}.png`);

    try {
        await fs.mkdir(outputDir, { recursive: true });

        const [regularImageMetadata, watermarkImageMetadata] = await Promise.all([
            sharp(regularImagePath).metadata(),
            sharp(watermarkImagePath).metadata()
        ]);

        let top, left;
        const margin = 10;

        switch (position) {
            case 'top-left':
                top = margin;
                left = margin;
                break;
            case 'top-right':
                top = margin;
                left = regularImageMetadata.width - watermarkImageMetadata.width - margin;
                break;
            case 'bottom-left':
                top = regularImageMetadata.height - watermarkImageMetadata.height - margin;
                left = margin;
                break;
            case 'bottom-right':
                top = regularImageMetadata.height - watermarkImageMetadata.height - margin;
                left = regularImageMetadata.width - watermarkImageMetadata.width - margin;
                break;
            default: // center
                top = Math.round((regularImageMetadata.height - watermarkImageMetadata.height) / 2);
                left = Math.round((regularImageMetadata.width - watermarkImageMetadata.width) / 2);
        }

        await sharp(regularImagePath)
            .resize(regularImageMetadata.width, regularImageMetadata.height) // size must match the div prievow in the frotnend
            .composite([{
                input: watermarkImagePath,
                top: top,
                left: left,
                blend: 'overlay',
                opacity: parseFloat(opacity) / 100 // take opacity from the frontend and throw it here yeeeett
            }])
            .toFile(outputImagePath);

        res.download(outputImagePath, async (err) => {
            if (err) {
                console.error('Error exporting image:', err);
                return res.status(500).send('Error exporting image');
            }

            try {
                await fs.unlink(outputImagePath);
                await fs.unlink(regularImagePath);
                await fs.unlink(watermarkImagePath);
            } catch (cleanupErr) {
                console.error('Error cleaning up files:', cleanupErr);
            }
        });
    } catch (err) {
        console.error('Image processing error', err);
        res.status(500).send('Image processing error');
    }
});


export default router;
