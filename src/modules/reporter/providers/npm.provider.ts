import { ReportProvider } from './report.interface';
import { HttpService, Injectable, Logger, HttpStatus } from '@nestjs/common';

interface PackageJSON {
  dependencies: {
    [pkg: string]: string;
  };
  devDependencies: {
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
    packageJson.dependencies = packageJson.dependencies || {};
    packageJson.devDependencies = packageJson.devDependencies || {};

    const dependencies = Object.assign(
      {},
      packageJson.dependencies,
      packageJson.devDependencies,
    );

    if (Object.keys(dependencies).length < 1) {
      throw new Error(
        "Specified repository doesn't have any dependencies or devDependencies in package.json file!",
      );
    }

    return Promise.all(
      Object.keys(dependencies).map(async pkg => {
        const version = dependencies[pkg];
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
    let latestVersion: NodePackage;
    try {
      latestVersion = await this.getLatestVersion(pkg);
    } catch (error) {
      if (error.response && error.response.status === HttpStatus.NOT_FOUND) {
        return undefined;
      }
      this.logger.error(error);
    }
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
