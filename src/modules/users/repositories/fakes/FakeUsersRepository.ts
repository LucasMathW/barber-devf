import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import { v4 as uuid } from 'uuid';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter((user) => user.id !== except_user_id);
    }

    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const fundedUser = this.users.find((user) => user.id === id);
    return fundedUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const fundedUser = this.users.find((user) => user.email === email);
    return fundedUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const fundedIndex = this.users.findIndex(
      (userIndex) => userIndex.id === user.id,
    );

    this.users[fundedIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
