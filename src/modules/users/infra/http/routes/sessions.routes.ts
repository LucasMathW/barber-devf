import { Router } from 'express';
import SessionsController from '../controllers/SessionsController';
import { celebrate, Segments, Joi } from 'celebrate';
const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post('/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.authenticate
);

export default sessionsRouter;
