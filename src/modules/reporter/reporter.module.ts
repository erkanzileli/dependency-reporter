import { Module, HttpModule } from '@nestjs/common';
import { ReporterService } from './reporter.service';
import { NpmProvider } from './providers/npm.provider';

@Module({
  imports: [HttpModule],
  exports: [HttpModule, NpmProvider],
  providers: [ReporterService, NpmProvider],
})
export class ReporterModule {}
