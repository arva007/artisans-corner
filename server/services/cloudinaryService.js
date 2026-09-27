const { cloudinary, isConfigured } = require('../config/cloudinary');

const uploadImageBuffer = async (buffer, folder = 'artisan_products') => {
  // If Cloudinary is properly configured with non-placeholder credentials
  if (isConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
        },
        (error, result) => {
          if (error) {
            console.error('[Cloudinary] Upload failed:', error);
            return reject(error);
          }
          resolve(result.secure_url);
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Graceful fallback for local development without Cloudinary credentials:
  // Return a data URI from the buffer so the image displays immediately in the app!
  const base64 = buffer.toString('base64');
  return `data:image/jpeg;base64,${base64}`;
};

module.exports = {
  uploadImageBuffer,
};
