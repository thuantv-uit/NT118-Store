import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from "dotenv"

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Function to upload file to Cloudinary
export const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: folderName }, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

// module.exports = { streamUpload }