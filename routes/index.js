import express from "express";
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();


router.get('/', (req, res)=>{
    res.render('index')
})


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

export default router;