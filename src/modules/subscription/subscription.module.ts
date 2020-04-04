import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionController } from './subscription.controller';
import { Subscription } from './subscription.entity';
import { TasksService } from '../task/tasks.service';
import { ReporterService } from '../reporter/reporter.service';
import { ReporterModule } from '../reporter/reporter.module';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription]),
    ReporterModule,
    EmailModule,
  ],
  exports: [TypeOrmModule],
  providers: [
    SubscriptionsService,
    TasksService,
    ReporterService,
    EmailService,
  ],
  controllers: [SubscriptionController],
})
export class SubscriptionModule implements OnApplicationBootstrap {
  constructor(
    private readonly subscriptionService: SubscriptionsService,
    private readonly tasksService: TasksService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const subscriptions = await this.subscriptionService.findAll();
    subscriptions.forEach(subscription => {
      const { cron, job, name } = this.subscriptionService.createCronJob(
        subscription,
      );
      this.tasksService.addCronJob(cron, job, name);
    });
  }
}
