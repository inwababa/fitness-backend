import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MembershipModule } from './membership/membership.module';
import { BillingModule } from './billing/billing.module';
import { Membership } from './membership/entities/membership.entity';
import { AddOn } from './membership/entities/adds-on.entity';
import { Invoice } from './billing/entities/billing.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';


const entities = [Membership, AddOn, Invoice];


@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
  //Add to the import array
  TypeOrmModule.forRoot({
    type: process.env.TYPE as any,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: entities,
    synchronize: true,
  }),
  MembershipModule, BillingModule,
  ScheduleModule.forRoot(),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
