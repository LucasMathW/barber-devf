import IParserMailTemplateDTO from '../../MailTemplateProvider/dto/IParserMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParserMailTemplateDTO;
}
