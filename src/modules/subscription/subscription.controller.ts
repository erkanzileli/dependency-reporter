import { Controller, Get, Post, Body, UseFilters } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription';
import { TypeOrmExceptionFilter } from 'src/filters/typeorm-exception.filter';
import { ErrorExceptionFilter } from 'src/filters/error-exception.filter';
import { Report } from '../reporter/dto/report';

@Controller({ path: 'subscription' })
@UseFilters(ErrorExceptionFilter)
export class SubscriptionController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  getAll(): Promise<Subscription[]> {
    return this.subscriptionsService.findAll();
  }

  @Post()
  @UseFilters(TypeOrmExceptionFilter)
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription | { result: Report[] }> {
    return this.subscriptionsService.createAndGetReport(createSubscriptionDto);
  }
}
