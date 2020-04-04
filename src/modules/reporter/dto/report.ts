class Dependencies {
  package: string;
  actual: string;
  available: string;
}

export class Report {
  dependencies: Dependencies;
  devDependencies: Dependencies;
}
