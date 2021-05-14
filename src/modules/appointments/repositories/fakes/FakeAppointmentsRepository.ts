import { v4 as uuid } from 'uuid';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointmentes: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findedAppointment = this.appointmentes.find(
      (appointment) => appointment.date === date,
    );

    return findedAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id });

    this.appointmentes.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
