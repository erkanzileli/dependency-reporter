import { Module, HttpModule } from '@nestjs/common';
import { ReporterService } from './reporter.service';
import { NpmProvider } from './providers/npm.provider';
import { ComposerProvider } from './providers/composer.provider';

@Module({
  imports: [HttpModule],
  exports: [HttpModule, NpmProvider, ComposerProvider],
  providers: [ReporterService, NpmProvider, ComposerProvider],
})
export class ReporterModule {}
