import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private scheduler: SchedulerRegistry) {}

  addIfNotExist(cron: string, job: () => any, name: string) {
    try {
      const cronjob = this.scheduler.getCronJob(name);
    } catch (error) {
      console.log(error)
      this.addCronJob(cron, job, name);
    }
  }

  addCronJob(cron: string, job: () => any, name: string) {
    const cronjob = new CronJob(cron, job);
    this.scheduler.addCronJob(name, cronjob);
    cronjob.start();
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
