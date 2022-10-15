import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordController {
  public async resetPassword(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { password, token } = request.body;

    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({
      password,
      token,
    });

    return response
      .json({ message: 'password changed with success' })
      .status(204);
  }
}
