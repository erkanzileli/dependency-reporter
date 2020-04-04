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

  async createAndGetReport(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription | { result: Report[] }> {
    // create report
    const reports = await this.getReport(createSubscriptionDto.repository);

    // if its reportable then save the subscription
    const subscription = await this.findOrCreate(createSubscriptionDto);

    this.schedule(subscription);

    // return result
    return { ...subscription, result: reports };
  }

  getReport(repository: string): Promise<Report[]> {
    return this.reporterService.createReport(repository);
  }

  schedule(subscription: Subscription) {
    const { cron, job, name } = this.createCronJob(subscription);
    this.tasksService.addIfNotExist(cron, job, name);
  }

  create(createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = new Subscription();
    subscription.email = createSubscriptionDto.email;
    subscription.repository = createSubscriptionDto.repository;
    return this.subscriptionsRepository.save(subscription);
  }

  async findOrCreate(createSubscriptionDto: CreateSubscriptionDto) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: {
        email: createSubscriptionDto.email,
        repository: createSubscriptionDto.repository,
      },
    });
    if (subscription) {
      return subscription;
    } else {
      return this.create(createSubscriptionDto);
    }
  }

  createCronJob(
    subscription: Subscription,
  ): { cron: string; job: () => any; name: string } {
    const createdAt = subscription.createdAt;
    const cron =
      createdAt.getSeconds() +
      ' ' +
      createdAt.getMinutes() +
      ' ' +
      createdAt.getHours() +
      ' * * *';

    const job = async () => {
      const report = await this.reporterService.createReport(
        subscription.repository,
      );
      this.emailService.sendEmail(
        subscription.email,
        'Daily dependency update check on ' + subscription.repository,
        JSON.stringify(report, null, 4),
      );
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
