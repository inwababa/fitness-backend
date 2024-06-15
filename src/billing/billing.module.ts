import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { MembershipService } from 'src/membership/membership.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/billing.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import { AddOn } from 'src/membership/entities/adds-on.entity';
import { MembershipModule } from 'src/membership/membership.module';
import { EmailService } from 'src/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Membership, AddOn]), MembershipModule],
  controllers: [BillingController],
  providers: [BillingService, MembershipService, EmailService],
})
export class BillingModule {}
