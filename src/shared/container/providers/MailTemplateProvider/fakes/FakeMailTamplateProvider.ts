import IMailTemplateProvider from '../models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parser(): Promise<string> {
    return 'mail content';
  }
}

export default FakeMailTemplateProvider;
