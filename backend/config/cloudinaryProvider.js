import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload single file
export const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Upload multiple files (parallel, handle partial errors)
export const uploadMultiple = async (fileBuffers, folderName) => {
  if (!Array.isArray(fileBuffers) || fileBuffers.length === 0) {
    throw new Error('fileBuffers must be a non-empty array of Buffers');
  }

  // Upload parallel với Promise.allSettled
  const uploadPromises = fileBuffers.map(buffer => streamUpload(buffer, folderName));
  const results = await Promise.allSettled(uploadPromises);

  // Filter thành công & collect errors
  const successfulUrls = [];
  const errors = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successfulUrls.push(result.value.secure_url);
    } else {
      console.error(`Upload failed for file ${index}:`, result.reason);
      errors.push(`File ${index}: ${result.reason.message || result.reason}`);
    }
  });

  if (errors.length > 0) {
    throw new Error(`Partial upload failure: ${errors.join('; ')}`);
  }

  return successfulUrls;
};