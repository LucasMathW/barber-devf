import { startOfHour, getHours, isBefore, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface Request {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class createAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: Request): Promise<Appointment> {
    const appointmentOfDate = startOfHour(date);

    if (isBefore(appointmentOfDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself");
    }

    if (getHours(appointmentOfDate) < 8 || getHours(appointmentOfDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm',
      );
    }

    const findAppointmentInSomeDate = await this.appointmentsRepository.findByDate(
      appointmentOfDate,
    );

    if (findAppointmentInSomeDate) {
      throw new AppError('Appointment already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentOfDate,
    });

    const dateFormatted = format(appointmentOfDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para o dia ${dateFormatted}`
    })

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(appointmentOfDate, 'yyyy-M-d')}`
    )

    return appointment;
  }
}

export default createAppointmentService;
