import { getRepository, Repository } from 'typeorm';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generated(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({ user_id });

    console.log('User Token', userToken);

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findByToken(user_id: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: {
        user_id,
      },
    });

    return userToken;
  }
}

export default UserTokensRepository;
