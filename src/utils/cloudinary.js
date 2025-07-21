import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath) => {
  try {
    if (!filePath) throw new Error('No file path');
    const result = await cloudinary.uploader.upload(filePath, { resource_type: 'auto' });
    fs.unlinkSync(filePath); // clean up temp file
    return result.secure_url; // return only the URL
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw err;
  }
};
