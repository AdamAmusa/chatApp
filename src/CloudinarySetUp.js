import {v2 as cloudinary} from 'cloudinary';
import { configDotenv } from 'dotenv';

configDotenv();


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    secure: true,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});




export default cloudinary;