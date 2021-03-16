import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import Appointment from '../models/Appointment';

interface Request {
  provider: string;
  date: Date;
}

class createAppointmentService {
  public async execute({ provider, date }: Request): Promise<Appointment> {
    const appointmentsRespository = getCustomRepository(AppointmentsRepository);

    const appointmentOfDate = startOfHour(date);

    const findAppointmentInSomeDate = appointmentsRespository.findOne(
      appointmentOfDate,
    );

    if (findAppointmentInSomeDate) {
      throw Error('Appointment already booked');
    }

    const appointment = appointmentsRespository.create({
      provider,
      date: appointmentOfDate,
    });

    await appointmentsRespository.save(appointment);

    return appointment;
  }
}

export default createAppointmentService;
