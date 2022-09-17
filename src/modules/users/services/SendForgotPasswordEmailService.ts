import { inject, injectable } from 'tsyringe';
import IEmailProvider from '@shared/container/providers/EmailProvider/models/IEmailProvides';
import AppError from '@shared/errors/AppError';
import path from 'path';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('EmailProvider')
    private emailProvider: IEmailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('user does not exist');
    }

    const { token } = await this.userTokensRepository.generated(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'resetPassword.hbs',
    );

    await this.emailProvider.sendMail({
      to: {
        name: user.email,
        email: user.email,
      },
      subject: '[Go Barber] Password Recovery',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          token,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
