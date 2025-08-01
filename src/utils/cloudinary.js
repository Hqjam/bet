import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const uploadImage = async (filePath) => {
  try {
    console.log('=== INSIDE UPLOAD FUNCTION ===');
    console.log('Raw env values:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('Env keys available:', Object.keys(process.env).filter(key => key.startsWith('CLOUDINARY')));
    console.log('===============================');

    // Configure Cloudinary inside the function
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log('Attempting to upload:', filePath);
    if (!filePath) throw new Error('No file path');
    
    const result = await cloudinary.uploader.upload(filePath, { 
      resource_type: "auto" 
    });
    
    console.log('Upload successful:', result.secure_url);
    fs.unlinkSync(filePath); // clean up temp file
    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw err;
  }
};
