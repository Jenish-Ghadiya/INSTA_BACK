import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } from '../config/db.config.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET,
});


const uploadImage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'vatu',
        allowedFormats: ['jpeg', 'png', 'jpg',"mp4","webp","heic","heif"],
    },
});

const upLoad = multer({ storage: uploadImage });

export default upLoad;
