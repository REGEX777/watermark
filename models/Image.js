import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
    regularImage: { type: String, required: true },
    watermarkImage: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('Image', ImageSchema);

export default Image;
