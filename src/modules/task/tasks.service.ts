import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Subscription } from '../subscription/subscription.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private scheduler: SchedulerRegistry) {}

  addCronJob(subscription: Subscription) {
    const createdAt = subscription.createdAt;
    console.log(
      createdAt.getSeconds(),
      createdAt.getMinutes(),
      createdAt.getHours(),
    );
    createdAt.setSeconds(createdAt.getSeconds() + 10);
    createdAt.setHours(createdAt.getHours() + 3);
    const job = new CronJob(
      createdAt.getSeconds() +
        ' ' +
        createdAt.getMinutes() +
        ' ' +
        createdAt.getHours() +
        ' * * *',
      () => {
        this.logger.warn(
          `scheduled job runned for subscription: ${subscription.email +
            '*' +
            subscription.repository} at ${new Date()}`,
        );

        this.getCrons();
      },
    );

    this.scheduler.addCronJob(
      subscription.email + '*' + subscription.repository,
      job,
    );
    job.start();

    this.logger.warn(
      `job scheduled for subscription: ${subscription.email +
        '*' +
        subscription.repository} at ${new Date()}`,
    );
  }

  deleteCron(name: string) {
    this.scheduler.deleteCronJob(name);
    this.logger.warn(`job ${name} deleted!`);
  }

  getCrons() {
    const jobs = this.scheduler.getCronJobs();
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDates().toDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
  }
}
