import multer from 'multer';
import { Request } from 'express';

// Enhanced upload middleware with comprehensive file handling
export const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 500 * 1024 * 1024, // 500MB as mentioned in requirements
    files: 50 // Support multiple file uploads
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Support all file types as per iLovePDF/PDFCandy standards
    const allowedTypes = [
      'application/pdf',
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/tiff', 'image/heic',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain', 'text/html', 'application/rtf'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/') || file.mimetype.startsWith('text/')) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  }
});

// Specialized upload handlers for different tool categories
export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', 50);
export const uploadFields = upload.fields([
  { name: 'files', maxCount: 50 },
  { name: 'watermark', maxCount: 1 }
]);