import { memoryStorage } from 'multer';

export const multerPhotoConfig = {
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit of 10MB
    fieldSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|heic)$/)) {
      const error = new Error('Only image files are allowed!');
      error['code'] = 'LIMIT_FILE_TYPES'; // Set an error code
      return callback(error, false);
    }
    callback(null, true);
  },
};
