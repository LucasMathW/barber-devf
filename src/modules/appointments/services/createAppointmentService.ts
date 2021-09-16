import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
  provider_id: string;
  date: Date;
}

@injectable()
class createAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentOfDate = startOfHour(date);

    const findAppointmentInSomeDate = await this.appointmentsRepository.findByDate(
      appointmentOfDate,
    );

    if (findAppointmentInSomeDate) {
      throw new AppError('Appointment already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentOfDate,
    });

    return appointment;
  }
}

export default createAppointmentService;
