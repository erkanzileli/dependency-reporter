import { Controller, Get } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './subscription.entity';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  getAll(): Promise<Subscription[]> {
    return this.subscriptionsService.findAll();
  }
}
