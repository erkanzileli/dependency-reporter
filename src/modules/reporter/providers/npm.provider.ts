import { ReportProvider } from './report.interface';
import { HttpService, Injectable, Logger } from '@nestjs/common';

interface PackageJSON {
  dependencies: {
    [pkg: string]: string;
  };
}

interface NodePackage {
  version: string;
  'dist-tags': {
    latest: string;
  };
}

@Injectable()
export class NpmProvider implements ReportProvider {
  private readonly logger = new Logger(NpmProvider.name);

  constructor(private httpService: HttpService) {}

  async createReport(downloadUrl: string): Promise<any> {
    const packageJson: PackageJSON = await this.getDependencyFile(downloadUrl);
    if (
      !packageJson.dependencies ||
      Object.keys(packageJson.dependencies).length < 1
    ) {
      throw new Error(
        "Specified repository doesn't have any dependencies in package.json file!",
      );
    }
    return Promise.all(
      Object.keys(packageJson.dependencies).map(async pkg => {
        const version = packageJson.dependencies[pkg];
        return {
          package: pkg,
          actual: version,
          available: await this.isUpdateAvailable(pkg, version),
        };
      }),
    );
  }

  async getDependencyFile(downloadUrl: string): Promise<PackageJSON> {
    return this.httpService.axiosRef
      .get(downloadUrl)
      .then(response => response.data);
  }

  async isUpdateAvailable(pkg: string, version: string): Promise<any> {
    const latestVersion: NodePackage = await this.getLatestVersion(pkg);
    if (latestVersion.version !== version) {
      return latestVersion.version;
    }
    return undefined;
  }

  async getLatestVersion(pkg: string): Promise<any> {
    const stupidFlag = pkg.startsWith('@');
    let url = `https://registry.npmjs.org/${pkg}`;
    if (!stupidFlag) {
      url += '/latest';
    }
    return this.httpService.axiosRef
      .get(url)
      .then(response => response.data)
      .then((nodePkg: NodePackage) => {
        if (stupidFlag) {
          return { ...nodePkg, version: nodePkg['dist-tags'].latest };
        }
        return nodePkg;
      });
  }
}
