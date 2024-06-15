import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';
import { CreateAddOnDto } from './dto/create-add-on.dto';
import { AddOn } from './entities/adds-on.entity';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post('add-member')
  async createMembership(@Body() createMembershipDto: CreateMembershipDto): Promise<Membership> {
    return this.membershipService.createMembership(createMembershipDto);
  }

  @Post('add-on')
  async createAddOn(@Body() createAddOnDto: CreateAddOnDto): Promise<{ message: string; success: boolean; data: AddOn }> {
    return this.membershipService.createAddOn(createAddOnDto);
  }

  @Get('upcoming-dues')
  async getMembershipsWithUpcomingDueDates(@Query('daysAhead') daysAhead: number): Promise<Membership[]> {
    return this.membershipService.getMembershipsWithUpcomingDueDates(daysAhead);
  }

  @Get()
  async findAllMemberships(): Promise<Membership[]> {
    return this.membershipService.findAllMemberships();
  }

  @Get(':id')
  async findMembershipById(@Param('id') id: number): Promise<Membership> {
    return this.membershipService.findMembershipById(id);
  }
}
