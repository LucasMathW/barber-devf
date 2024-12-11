import { Router } from 'express';
import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';
import { celebrate, Segments, Joi } from 'celebrate';
import { uuid } from 'uuidv4';

const passwordRouter = Router();

const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post('/forgot',
  celebrate({
    [Segments.BODY] : {
      email: Joi.string().email().required(),
    }
  }),
  forgotPasswordController.sendForgotPassword
);


passwordRouter.post('/reset',
  celebrate({
    [Segments.BODY]: {
      token : Joi.string().uuid().required(),
      password : Joi.string().required(),
      passwordConfirmation: Joi.string().required().valid(Joi.ref("password"))
    }
  }),
  resetPasswordController.resetPassword
);

export default passwordRouter;
