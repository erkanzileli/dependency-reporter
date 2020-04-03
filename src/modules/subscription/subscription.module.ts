import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionController } from './subscription.controller';
import { Subscription } from './subscription.entity';
import { TasksService } from '../task/tasks.service';
import { ReporterService } from '../reporter/reporter.service';
import { ReporterModule } from '../reporter/reporter.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription]), ReporterModule],
  exports: [TypeOrmModule],
  providers: [SubscriptionsService, TasksService, ReporterService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
