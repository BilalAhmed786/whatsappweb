const multer = require('multer');
const path = require('path');

// Define storage options for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = '';
    if (file.mimetype.startsWith('image/')) {
      folder = 'public/images';
    } else if (
      file.mimetype.startsWith('application/pdf') ||
      file.mimetype.startsWith('application/msword')
    ) {
      folder = 'public/documents';
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'public/videos';
    } else if (file.mimetype.startsWith('audio/')) {
      folder = 'public/audio'; // Add a folder for audio files
    } else {
      return cb(new Error('Unsupported file type'), false);
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // Use original name or you can add timestamps or unique identifiers
    cb(null, file.originalname);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
