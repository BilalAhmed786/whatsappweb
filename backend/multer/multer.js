require('dotenv').config();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Setup Cloudinary storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'saifchat/other';
    let resourceType = 'raw';
    
    // Extract file extension cleanly
    const fileExt = file.originalname.split('.').pop().toLowerCase();
    const fileNameWithoutExt = file.originalname
      .substring(0, file.originalname.lastIndexOf('.'))
      .replace(/[^a-zA-Z0-9-_]/g, '_'); // Sanitize special characters

    if (file.mimetype.startsWith('image/')) {
      folder = 'saifchat/images';
      resourceType = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'saifchat/videos';
      resourceType = 'video';
    } else if (file.mimetype.startsWith('audio/')) {
      folder = 'saifchat/audio';
      resourceType = 'video'; // Cloudinary groups audio under 'video'
    } else if (
      file.mimetype.includes('pdf') ||
      file.mimetype.includes('msword') ||
      file.mimetype.includes('officedocument') ||
      file.mimetype.includes('text')
    ) {
      folder = 'saifchat/documents';
      resourceType = 'raw';
    }

    const publicId = `${Date.now()}-${fileNameWithoutExt}`;

    return {
      folder: folder,
      resource_type: resourceType,
      // For raw files, keep the extension in public_id so downloads retain format (.pdf, .docx)
      public_id: resourceType === 'raw' ? `${publicId}.${fileExt}` : publicId,
    };
  },
});

// 3. File filter to handle unsupported types safely without crashing
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/',
    'video/',
    'audio/',
    'application/pdf',
    'application/msword',
    'officedocument',
    'text/plain'
  ];

  const isAllowed = allowedMimeTypes.some((type) => file.mimetype.includes(type));

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// 4. Export the Multer middleware with file size limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size cap
});

module.exports = upload;