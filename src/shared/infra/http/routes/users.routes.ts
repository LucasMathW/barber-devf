import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../../../../config/upload';

import CreateUserService from '../../../../modules/users/services/createUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '../../../../modules/users/services/UpdateUserAvatarService';

interface UserProps {
  name: string;
  email: string;
  password?: string;
}

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;
  const createUser = new CreateUserService();
  const user: UserProps = await createUser.execute({ name, email, password });

  delete user.password;
  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();
    const user: UserProps = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
