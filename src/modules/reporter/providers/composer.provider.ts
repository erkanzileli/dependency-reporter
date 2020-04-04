import { ReportProvider } from './report.interface';

interface ComposerJSON {
  require: {
    [pkg: string]: string;
  };
}

interface ComposerPackage {
  package: {
    versions: {
      [version: string]: string;
    };
  };
}

export class ComposerProvider implements ReportProvider {
  createReport(downloadUrl: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  getDependencyFile(downloadUrl: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  isUpdateAvailable(pkg: string, version: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  getLatestVersion(pkg: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
