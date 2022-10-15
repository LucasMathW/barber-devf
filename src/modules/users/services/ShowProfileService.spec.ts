import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('Show profile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('Should be able show profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jonSnow@winterfell.com',
      name: 'Jon Snow',
      password: '12345678',
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.name).toBe('Jon Snow');
    expect(profile.email).toBe('jonSnow@winterfell.com');
  });

  it('Should not be able show user with a non-existing user id', async () => {
    expect(
      showProfile.execute({ user_id: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
