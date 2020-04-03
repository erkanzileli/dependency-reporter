export interface ReportProvider {
  getDependencyFile(downloadUrl: string): Promise<any>;
  isUpdateAvailable(pkg: string, version: string): Promise<any>;
  getLatestVersion(pkg: string): Promise<any>;
  createReport(downloadUrl: string): Promise<any>;
}
