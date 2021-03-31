import { Router } from 'express';
import User from '../models/User';
import CreateUserService from '../services/createUserService';

const usersRouter = Router();

interface UserProps {
  name: string;
  email: string;
  password?: string;
}

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

export default usersRouter;
