import { Controller, Get, Post, Body } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription';

@Controller({ path: 'subscription' })
export class SubscriptionController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  getAll(): Promise<Subscription[]> {
    return this.subscriptionsService.findAll();
  }

  @Post()
  create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionsService.create(createSubscriptionDto);
  }
}
