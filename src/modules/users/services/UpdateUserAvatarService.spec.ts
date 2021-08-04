import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/fakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../provider/hashProvider/fakes/FakeHashProvider';
import CreateUserService from './createUserService';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('Updade user vatar', () => {
  it('Should be able update user avatar', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await createUser.execute({
      name: 'Jon Snow',
      email: 'jon@winterMail.com',
      password: 'garralonga',
    });

    const updatedAvatar = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'newProfile.jpg',
    });

    expect(updatedAvatar.avatar).toBe('newProfile.jpg');
  });

  it('Should be able delete user avatar when updating new one', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await createUser.execute({
      name: 'Jon Snow',
      email: 'jon@winterMail.com',
      password: 'garralonga',
    });

    const updatedAvatar = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'newProfile.jpg',
    });

    const updatedAvatar2 = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'newProfile2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('newProfile.jpg');
    expect(updatedAvatar2.avatar).toBe('newProfile2.jpg');
  });

  it('Should not be able update user avatar when not authenticated', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await createUser.execute({
      name: 'Jon Snow',
      email: 'jon@winterMail.com',
      password: 'garralonga',
    });

    expect(
      updateUserAvatar.execute({
        user_id: '',
        avatarFilename: 'newProfile.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
