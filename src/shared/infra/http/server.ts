import 'reflect-metadata';
import "dotenv/config"

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from "celebrate";
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/RateLimit'
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter)
app.use(routes);
app.use(errors())

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      // console.log(response)
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    // console.error("ERROR =>", err)

    return response.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  },
);

const port = process.env.PORT

app.listen(port, () => {
  console.log('🚀Server on started on port 3333!');
});
