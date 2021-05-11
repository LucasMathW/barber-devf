import { Router } from 'express';
import { parseISO } from 'date-fns';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/createAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointmentsRepository = getCustomRepository(AppointmentsRepository);
//   const appointments = await appointmentsRepository.find();
//   return response.json(appointments);

// });

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parserDate = parseISO(date);

  const createAppointment = container.resolve(CreateAppointmentService);

  const appointment = await createAppointment.execute({
    date: parserDate,
    provider_id,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
