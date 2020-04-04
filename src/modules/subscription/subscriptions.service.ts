import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription';
import { TasksService } from '../task/tasks.service';
import { ReporterService } from '../reporter/reporter.service';
import { Report } from '../reporter/dto/report';
import { EmailService } from '../email/email.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly tasksService: TasksService,
    private readonly reporterService: ReporterService,
    private readonly emailService: EmailService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription | { result: Report }> {
    const subscription = new Subscription();
    subscription.email = createSubscriptionDto.email;
    subscription.repository = createSubscriptionDto.repository;

    // create report
    const reports = await this.reporterService.createReport(
      subscription.repository,
    );

    // if its reportable then save the subscription
    await this.subscriptionsRepository.save(subscription);

    // create cronjob
    const { cron, job, name } = this.createCronJob(subscription);
    this.tasksService.addCronJob(cron, job, name);
    // return result
    return { ...subscription, result: reports };
  }

  createCronJob(
    subscription: Subscription,
  ): { cron: string; job: () => any; name: string } {
    const createdAt = subscription.createdAt;
    createdAt.setSeconds(createdAt.getSeconds() + 15);
    // createdAt.setHours(createdAt.getHours() + 3)
    const cron =
      createdAt.getSeconds() +
      ' ' +
      createdAt.getMinutes() +
      ' ' +
      createdAt.getHours() +
      ' * * *';

    const job = () => {
      // const report = await this.reporterService.createReport(
      //   subscription.repository,
      // );
      this.emailService.sendEmail(subscription.email, '', '');
    };
    const name = `${subscription.email}+${subscription.repository}`;
    return { cron, job, name };
  }

  findAll(): Promise<Subscription[]> {
    return this.subscriptionsRepository.find();
  }

  findOne(id: string): Promise<Subscription> {
    return this.subscriptionsRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionsRepository.delete(id);
  }
}
