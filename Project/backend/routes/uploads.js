import express from 'express';
import multer from 'multer';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/uploads
router.post('/', upload.array('files'), async (req, res) => {
  try {
    const files = req.files || [];
    console.log(`[uploads] Received ${files.length} files`);
    console.log('[uploads] env cloud_name=', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('[uploads] env api_key present=', !!process.env.CLOUDINARY_API_KEY);

    // Quick guard for missing Cloudinary env vars
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('[uploads] Missing Cloudinary environment variables');
      return res.status(500).json({ success: false, message: 'Cloudinary configuration missing on server' });
    }
    const uploadResults = [];

    for (const file of files) {
      try {
        const streamUpload = () => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'nt118_products' },
              (error, result) => {
                if (result) resolve(result);
                else {
                  console.error('[uploads] cloudinary callback error', error);
                  reject(error || new Error('Unknown upload error'));
                }
              }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
          });
        };

        const result = await streamUpload();
        console.log('[uploads] Uploaded:', result.public_id || result.secure_url);
        uploadResults.push({ url: result.secure_url, public_id: result.public_id, resource_type: result.resource_type });
      } catch (fileErr) {
        console.error('[uploads] File upload failed:', file.originalname, fileErr);
        // include an error placeholder for this file so client can see which failed
        uploadResults.push({ error: fileErr.message || 'upload_failed', filename: file.originalname });
      }
    }

    res.json({ success: true, files: uploadResults });
  } catch (err) {
    console.error('Upload error', err);
    res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
});

export default router;
