import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionController } from './subscription.controller';
import { Subscription } from './subscription.entity';
import { TasksService } from '../task/tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  exports: [TypeOrmModule],
  providers: [SubscriptionsService, TasksService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
