import { Controller, Get, Post, Body, UseFilters } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription';
import { TypeOrmExceptionFilter } from 'src/filters/typeorm-exception.filter';

@Controller({ path: 'subscription' })
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
  ): Promise<Subscription> {
    return this.subscriptionsService.create(createSubscriptionDto);
  }
}
