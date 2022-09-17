import IEmailProvider from '../models/IEmailProvides';
import ISendMailDTO from '../dto/ISendMailDTO';

export default class FakeEmailProvider implements IEmailProvider {
  private messages: ISendMailDTO[] = [];

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.messages.push(message);
  }
}
