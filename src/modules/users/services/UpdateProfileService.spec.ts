import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../provider/hashProvider/fakes/FakeHashProvider';
import UpdateProfilerService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfilerService;

describe('Update Profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfile = new UpdateProfilerService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jonSnow@winterfell.com',
      name: 'Jon Snow',
      password: '12345678',
    });

    const userUpdate = await updateProfile.execute({
      user_id: user.id,
      email: 'jonSnow@dragonStone.com',
      name: 'Jon Targaryen',
      old_password: '12345678',
      password: 'newPassword',
    });

    expect(userUpdate.name).toBe('Jon Targaryen');
    expect(userUpdate.email).toBe('jonSnow@dragonStone.com');
  });

  it('Should not be able update profile from non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        email: 'jhonThree@mailexample.com',
        name: 'Test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able update profile with another email', async () => {
    await fakeUsersRepository.create({
      email: 'jonSnow@wintterfel.com',
      name: 'Jon Snow',
      password: '12345678',
    });

    const user = await fakeUsersRepository.create({
      email: 'aegon@dragonStone.com',
      name: 'Aegon Targaryan',
      password: '12345678',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'jonSnow@wintterfel.com',
        name: 'Aegon Targaryan',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able update profile without old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'Jon Snow',
      name: 'jonSnow@wintterfel.com',
      password: '12345678',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'jonSnow@wintterfel.com',
        name: 'Jon Snow',
        password: 'newPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able update profile with incorrect old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'Jon Snow',
      name: 'jonSnow@wintterfel.com',
      password: '12345678',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'jonSnow@wintterfel.com',
        name: 'Jon Snow',
        old_password: 'wrongPassword',
        password: 'newPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
