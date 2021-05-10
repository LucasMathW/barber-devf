import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import AppointmentsRepository from '../infra/typeorm/repositories/AppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface Request {
  provider_id: string;
  date: Date;
}

class createAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentOfDate = startOfHour(date);

    const findAppointmentInSomeDate = await appointmentsRepository.findByDate(
      appointmentOfDate,
    );

    if (findAppointmentInSomeDate) {
      throw new AppError('Appointment already booked');
    }

    const appointment = await appointmentsRepository.create({
      provider_id,
      date: appointmentOfDate,
    });

    return appointment;
  }
}

export default createAppointmentService;
