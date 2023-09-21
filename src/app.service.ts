import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/createuser.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import setTimeout = jest.setTimeout;

@Injectable()
export class AppService {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  private schedulerRegistry: SchedulerRegistry;
  private readonly logger = new Logger(AppService.name);
  getHello(): string {
    return 'Hello World!';
  }
  async createUser(body: CreateUserDto) {
    this.logger.log('Creating a  new user');
    console.log(body);
    const userId = '12313';
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(userId, body.email),
    );
  }

  @OnEvent('user.created')
  welcomeNewUser(payload: UserCreatedEvent) {
    this.logger.log('welcoming new user....', payload.email);
  }

  @OnEvent('user.created', { async: true })
  async sendWelcomeGift(payload: UserCreatedEvent) {
    this.logger.log('sending user gift....', payload.email);
  }

  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'delete_expire_users' })
  deleteExpireUser() {
    console.log('Deleting user...');
  }
}
