import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './createAppointmentService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';


let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;
let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository

describe('Create Appointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository, fakeCacheProvider, fakeNotificationsRepository);
  });

  it('Should be able create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 9, 9, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2024, 9, 9, 13),
      user_id: '123',
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('Should not able to create tow appointments on the some time', async () => {
    const appointmentDate = new Date(2024, 11, 21, 13);

    // console.log('date =>', appointmentDate);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: '123',
      provider_id: '123123',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: '123',
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 7, 31, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2024, 7, 31, 11),
        user_id: '123123',
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 8, 2, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2024, 8, 2, 13),
        user_id: 'user-id',
        provider_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 9, 9, 13).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2024, 8, 2, 7),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2024, 8, 2, 18),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
