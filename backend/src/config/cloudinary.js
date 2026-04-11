const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'celebrations';
    let resourceType = 'auto';
    
    if (file.fieldname === 'images') {
      folder = 'celebrations/images';
    } else if (file.fieldname === 'audio') {
      folder = 'celebrations/audio';
      resourceType = 'video'; // Cloudinary uses 'video' for audio files
    } else if (file.fieldname === 'video') {
      folder = 'celebrations/videos';
      resourceType = 'video';
    }
    
    return {
      folder: folder,
      resource_type: resourceType,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'mp3', 'wav', 'mp4', 'avi', 'mov']
    };
  }
});

const upload = multer({ storage });

module.exports = upload;
