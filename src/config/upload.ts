import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const tempFold = path.resolve(__dirname, '..', '..', 'temp');

export default {
  directory: tempFold,
  storage: multer.diskStorage({
    destination: tempFold,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
