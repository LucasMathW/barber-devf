import AppError from '@shared/errors/AppError';
import FakeEmailProvider from '@shared/container/providers/EmailProvider/fakes/fakeEmailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeEmailProvider: FakeEmailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('Recovery password', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeEmailProvider = new FakeEmailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeEmailProvider,
      fakeUserTokensRepository,
    );
  });

  it('Should be able recovery password with e-mail ', async () => {
    const sendMail = jest.spyOn(fakeEmailProvider, 'sendMail');

    await fakeUsersRepository.create({
      email: 'lucas.alencar107@gmail.com',
      name: 'Lucas Matheus',
      password: '12345678',
    });

    await sendForgotPasswordEmail.execute({
      email: 'lucas.alencar107@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('It should not be possible that user who does not exist can recover password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'lucas.alencar@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('It should generate forgot password token', async () => {
    const generatedToken = jest.spyOn(fakeUserTokensRepository, 'generated');

    const user = await fakeUsersRepository.create({
      name: 'Lucas Matheus',
      email: 'lucas.alencar107@gmail.com',
      password: '12345678',
    });

    await sendForgotPasswordEmail.execute({
      email: 'lucas.alencar107@gmail.com',
    });

    expect(generatedToken).toHaveBeenCalledWith(user.id);
  });
});
