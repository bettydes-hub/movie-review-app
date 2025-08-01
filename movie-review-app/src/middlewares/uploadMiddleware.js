const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

// Local storage configuration for Multer
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('📁 Multer destination called for file:', file.originalname);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log('📁 Multer filename generated:', filename);
    cb(null, filename);
  }
});

// Multer configuration for single image upload
const handleImageUpload = multer({
  storage: localStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 Multer fileFilter called for:', file.originalname);
    console.log('🔍 File mimetype:', file.mimetype);
    
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      console.log('✅ File type accepted');
      cb(null, true);
    } else {
      console.log('❌ File type rejected:', file.mimetype);
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('image');

// Wrapper middleware with error handling
const uploadMiddleware = (req, res, next) => {
  console.log('🚀 Upload middleware started');
  console.log('📋 Request headers:', req.headers['content-type']);
  
  handleImageUpload(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      
      if (err instanceof multer.MulterError) {
        console.error('❌ Multer specific error:', err.code);
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            message: 'File too large. Maximum size is 5MB.' 
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ 
            message: 'Too many files uploaded.' 
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ 
            message: 'Unexpected file field.' 
          });
        }
      }
      return res.status(400).json({ 
        message: err.message || 'Error uploading file' 
      });
    }

    console.log('📁 Multer processing completed');
    console.log('📁 req.file:', req.file);
    console.log('📁 req.body:', req.body);

    // Check if file was uploaded
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ 
        message: 'Please upload an image file' 
      });
    }

    // Create a local URL for the uploaded file
    const localUrl = `/uploads/${req.file.filename}`;
    req.body.image = localUrl;
    console.log('📁 File saved locally:', req.file.path);
    console.log('🔗 Local URL:', localUrl);
    console.log('✅ Upload middleware completed successfully');
    next();
  });
};

module.exports = {
  handleImageUpload: uploadMiddleware
}; 