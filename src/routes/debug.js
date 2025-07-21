import express from 'express';
const router = express.Router();

router.get('/debug/env', (_req, res) => {
  res.json({
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***' : null,
  });
});

export default router;
