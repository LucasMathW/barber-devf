import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../provider/hashProvider/fakes/FakeHashProvider';
import CreateUserService from './createUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('Should be able create a new user', async () => {
    const user = await createUser.execute({
      name: 'Lucas Matheus',
      email: 'lucasag0408@outlook.com',
      password: 'meusegredão',
    });

    expect(user).toHaveProperty('id');
  });

  it('Should not able to create a new user on the some email', async () => {
    await createUser.execute({
      name: 'Lucas Matheus',
      email: 'lucasag0408@outlook.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Lucas Matheus',
        email: 'lucasag0408@outlook.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
