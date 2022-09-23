import handlebars from 'handlebars';
import fs from 'fs';
import IParserMailTemplateDTO from '../dto/IParserMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parser({
    file,
    variables,
  }: IParserMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parserTemplate = handlebars.compile(templateFileContent);
    return parserTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
