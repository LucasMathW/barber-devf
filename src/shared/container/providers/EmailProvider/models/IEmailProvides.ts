import ISendMailDTO from '../dto/ISendMailDTO';

export default interface IEMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
