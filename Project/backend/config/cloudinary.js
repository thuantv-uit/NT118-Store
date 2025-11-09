import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Debug: print cloud name (do NOT print api secret in logs)
console.log('[cloudinary] configured cloud_name=', process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME : '<missing>');
console.log('[cloudinary] api_key present=', !!process.env.CLOUDINARY_API_KEY);

export default cloudinary;
