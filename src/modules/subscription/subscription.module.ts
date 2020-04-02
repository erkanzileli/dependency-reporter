import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionController } from './subscription.controller';
import { Subscription } from './subscription.entity';
import { TaskService } from '../task/task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  exports: [TypeOrmModule],
  providers: [SubscriptionsService, TaskService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
