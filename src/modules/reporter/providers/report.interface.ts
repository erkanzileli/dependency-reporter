export interface ReportProvider {
  createReport(downloadUrl: string): Promise<any>;
  getDependencyFile(downloadUrl: string): Promise<any>;
  isUpdateAvailable(pkg: string, version: string): Promise<any>;
  getLatestVersion(pkg: string): Promise<any>;
}
