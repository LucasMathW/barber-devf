import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/createUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

interface UserProps {
  name: string;
  email: string;
  password?: string;
}

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();
    const user: UserProps = await createUser.execute({ name, email, password });

    delete user.password;
    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    console.log(request.file);
    return response.json({ ok: true });
  },
);

export default usersRouter;
