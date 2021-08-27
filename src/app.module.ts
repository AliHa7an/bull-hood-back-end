import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrokerModule } from './broker/broker.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    BrokerModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost/bull-hood'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
