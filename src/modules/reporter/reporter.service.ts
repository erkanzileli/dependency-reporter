import { Injectable, HttpService, Logger, HttpStatus } from '@nestjs/common';
import { NpmProvider } from './providers/npm.provider';
import { Report } from './dto/report';
import { ComposerProvider } from './providers/composer.provider';

interface Content {
  name: string;
  path: string;
  sha: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

@Injectable()
export class ReporterService {
  private readonly logger = new Logger(ReporterService.name);

  constructor(
    private httpService: HttpService,
    private npmReportProducer: NpmProvider,
    private composerReportProvider: ComposerProvider,
  ) {}

  public async createReport(repositoryUrl: string): Promise<Report> {
    const [, , , owner, repository] = repositoryUrl.split('/');

    const contents = await this.getRepositoryContents(owner, repository);

    const { downloadUrl, type } = await this.getDependencyFileMeta(contents);

    if (type === 'NPM') {
      return this.npmReportProducer.createReport(downloadUrl);
    }
    if (type === 'COMPOSER') {
      return this.composerReportProvider.createReport(downloadUrl);
    }
  }

  async getRepositoryContents(
    owner: string,
    repository: string,
  ): Promise<Content[]> {
    try {
      return this.httpService.axiosRef
        .get(`https://api.github.com/repos/${owner}/${repository}/contents`)
        .then(response => response.data);
    } catch (error) {
      if (error.response && error.response.status === HttpStatus.NOT_FOUND) {
        throw new Error('Repository not found!');
      }
    }
  }

  private getDependencyFileMeta(
    contents: Content[],
  ): { downloadUrl: string; type: 'NPM' | 'COMPOSER' } {
    for (const content of contents) {
      if (content.name === 'package.json') {
        return { downloadUrl: content.download_url, type: 'NPM' };
      }
      if (content.name === 'composer.json') {
        return { downloadUrl: content.download_url, type: 'COMPOSER' };
      }
    }
    throw new Error(
      "Didn't find any package.json or composer.json files on repository root directory.",
    );
  }

  private getPkgDetailsFromComposer(pkg: string): void {
    //todo: get composer pkg details
    throw new Error('Not implemented!');
  }
}
