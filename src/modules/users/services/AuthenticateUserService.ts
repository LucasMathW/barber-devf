import { sign } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../provider/hashProvider/models/IHashProvider';
import { classToClass } from 'class-transformer';

interface Request {
  email: string;
  password: string;
}
interface Response {
  user: User;
  token: string;
}
@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect combination email/password', 401);
    }

    const matchedPassword = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!matchedPassword) {
      throw new AppError('Incorrect combination email/password', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    // delete user.password

    return {
      user,
      token,
    };
  }
}
export default AuthenticateUserService;
