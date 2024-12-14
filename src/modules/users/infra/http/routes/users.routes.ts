import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UsersController from '../controllers/UsersController';
import UpdateAvatarController from '../controllers/UpdateAvatarController';
import { celebrate, Segments, Joi } from 'celebrate';

const usersRouter = Router();
const upload = multer(uploadConfig.multer);

const usersController = new UsersController();
const updateAvatarController = new UpdateAvatarController();

usersRouter.post('/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create
);

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  updateAvatarController.update,
);

export default usersRouter;
