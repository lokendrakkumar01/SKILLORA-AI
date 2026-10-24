// Cloudinary config — only used if cloudinary package is installed
let cloudinary: any = null;

try {
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'pkqwgvat',
    api_key: process.env.CLOUDINARY_API_KEY || '876913628793746',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'uOMBWmIOlkqhzFOJg6gHzfD5nxY',
  });
} catch {
  console.log('Cloudinary not installed — avatar uploads disabled');
}

export default cloudinary;
