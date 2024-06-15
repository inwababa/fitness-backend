import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { MembershipController } from './membership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { AddOn } from './entities/adds-on.entity';
import { Invoice } from 'src/billing/entities/billing.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Membership, AddOn, Invoice])],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
