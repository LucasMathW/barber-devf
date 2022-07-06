import { inject, injectable } from 'tsyringe';
import IEmailProvider from '@shared/container/providers/EmailProvider/fakes/fakeEmailProvider';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
// import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokensRepository';
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
    const userExist = await this.usersRepository.findByEmail(email);

    if (!userExist) {
      throw new AppError('user does not exist');
    }

    this.userTokensRepository.generated(userExist.id);

    this.emailProvider.sendMail(email, 'pedido de recuperação de senha');
  }
}

export default SendForgotPasswordEmailService;
