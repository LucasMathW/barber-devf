export default interface IEMailProvider {
  sendMail(to: string, body: string): Promise<void>;
}
