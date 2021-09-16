import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../provider/hashProvider/fakes/FakeHashProvider';
import CreateUserService from './createUserService';

describe('Create User', () => {
  it('Should be able create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Lucas Matheus',
      email: 'lucasag0408@outlook.com',
      password: 'meusegredão',
    });

    expect(user).toHaveProperty('id');
  });

  it('Should not able to create tow user on the some email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Lucas Matheus',
      email: 'lucasag0408@outlook.com',
      password: 'meusegredão',
    });

    expect(
      createUser.execute({
        name: 'Lucas Matheus',
        email: 'lucasag0408@outlook.com',
        password: 'meusegredão',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
