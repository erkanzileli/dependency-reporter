export interface ReportProvider {
  getRepositoryContents(owner: string, repository: string): Promise<any>;
  getDependencyFile(downloadUrl: string): Promise<any>;
  isUpdateAvailable(pkg: string, version: string): Promise<any>;
  getLatestVersion(pkg: string): Promise<any>;
  createReport(downloadUrl: string): Promise<any>;
}
