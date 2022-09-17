import AppError from '@shared/errors/AppError';
import { getHours } from 'date-fns';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../provider/hashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('Recovery password', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeUserTokensRepository,
    );
  });

  it('Should be able reset password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Lucas Matheus',
      email: 'lucasalencar@107@gmail.com',
      password: '12345678',
    });

    const { token } = await fakeUserTokensRepository.generated(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '12312312',
      token,
    });

    const userChanged = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('12312312');
    expect(userChanged?.password).toBe('12312312');
  });

  it('Should not be able reset password with non-exiting token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing',
        password: '651234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able reset password with non-exiting user', async () => {
    const { token } = await fakeUserTokensRepository.generated(
      'non-existing-token',
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: '651234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able reset password with token more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Lucas Matheus',
      email: 'lucasalencar@107@gmail.com',
      password: '12345678',
    });

    const { token } = await fakeUserTokensRepository.generated(user.id);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: '12312345',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
