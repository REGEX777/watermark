import express from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const router = express.Router();

// Route to serve the editor page
router.get('/editor', (req, res) => {
    res.render('editor'); // Render the editor page
});

// Route to handle image uploads
router.post('/upload', (req, res) => {
    const { regularImage, watermarkImage } = req.files;

    // Save regular image
    const regularImagePath = path.join(__dirname, '../uploads', regularImage.name);
    regularImage.mv(regularImagePath, (err) => {
        if (err) {
            return res.status(500).send('Error saving regular image');
        }
    });

    // Save watermark image
    const watermarkImagePath = path.join(__dirname, '../uploads', watermarkImage.name);
    watermarkImage.mv(watermarkImagePath, (err) => {
        if (err) {
            return res.status(500).send('Error saving watermark image');
        }
    });

    res.redirect(`/editor?regularImage=${regularImage.name}&watermarkImage=${watermarkImage.name}`);
});

// Route to handle image processing and export
router.post('/export', async (req, res) => {
    const { regularImage, watermarkImage, x, y } = req.body;

    const regularImagePath = path.join(__dirname, '../uploads', regularImage);
    const watermarkImagePath = path.join(__dirname, '../uploads', watermarkImage);

    const outputImagePath = path.join(__dirname, '../exports', `exported_${Date.now()}.png`);

    try {
        // Overlay the watermark on the regular image
        await sharp(regularImagePath)
            .composite([{ input: watermarkImagePath, top: parseInt(y), left: parseInt(x) }])
            .toFile(outputImagePath);

        res.download(outputImagePath, (err) => {
            if (err) {
                res.status(500).send('Error exporting image');
            }
        });
    } catch (err) {
        res.status(500).send('Error processing images');
    }
});

export default router;
