import multer from 'multer';
import path from 'path';

const tempPath = path.join('tmp');

/**
 * Configuration for multer to store uploaded files in a temporary directory.
 */
const multerConfig = multer.diskStorage({
  destination: tempPath,
  /**
   * Sets the filename of the uploaded file to its original name.
   *
   * @param {Object} req - The request object.
   * @param {Object} file - The file object.
   * @param {Function} cb - The callback function to set the filename.
   */
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});

export { upload };
