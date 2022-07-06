import IEmailProvider from '../models/IEmailProvides';

interface Message {
  to: string;
  body: string;
}

export default class FakeEmailProvider implements IEmailProvider {
  private messages: Message[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.messages.push({
      to,
      body,
    });
  }
}
