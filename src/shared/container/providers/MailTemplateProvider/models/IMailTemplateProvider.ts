import IParserMailTemplateDTO from '../dto/IParserMailTemplateDTO';

export default interface IMailTemplateProvider {
  parser(data: IParserMailTemplateDTO): Promise<string>;
}
