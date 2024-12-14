import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/fakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeStorageProvider: FakeStorageProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateUserAvatar: UpdateUserAvatarService;

describe('Update user avatar', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeUsersRepository = new FakeUsersRepository();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able update user avatar', async () => {
    const user = await fakeUsersRepository.create({
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

  it('Should not able to update avatar from non-existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing user',
        avatarFilename: 'newProfiles.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able delete user avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Jon Snow',
      email: 'jon@winterfellMail.com',
      password: 'garralonga',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'newProfile.jpg',
    });

    const updatedAvatar = await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'newProfile2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('newProfile.jpg');
    expect(updatedAvatar.avatar).toBe('newProfile2.jpg');
  });

  it('Should not be able update user avatar when not authenticated', async () => {
    await fakeUsersRepository.create({
      name: 'Jon Snow',
      email: 'jon@winterMail.com',
      password: 'garralonga',
    });

    await expect(
      updateUserAvatar.execute({
        user_id: '',
        avatarFilename: 'newProfile.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
