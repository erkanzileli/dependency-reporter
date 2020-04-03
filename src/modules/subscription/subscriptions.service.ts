import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription';
import { TasksService } from '../task/tasks.service';
import { ReporterService } from '../reporter/reporter.service';
import { Report } from '../reporter/dto/report';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    private readonly tasksService: TasksService,
    private readonly reporterService: ReporterService,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription | { result: Report[] }> {
    const subscription = new Subscription();
    subscription.email = createSubscriptionDto.email;
    subscription.repository = createSubscriptionDto.repository;
    const reports = await this.reporterService.createReport(
      subscription.repository,
    );
    console.log(reports);
    await this.subscriptionsRepository.save(subscription);
    this.tasksService.addCronJob(subscription);
    return { ...subscription, result: reports };
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
