import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Membership } from './entities/membership.entity';
import { Between, Repository } from 'typeorm';
import { AddOn } from './entities/adds-on.entity';
import { CreateAddOnDto } from './dto/create-add-on.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MembershipService {

  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(AddOn)
    private addOnRepository: Repository<AddOn>,
  ) {}

  async createMembership(createMembershipDto: CreateMembershipDto): Promise<Membership> {
    try {
      const membership = this.membershipRepository.create(createMembershipDto);
    return this.membershipRepository.save(membership);
    } catch (error) {
      throw new InternalServerErrorException({message: 'Failed to create membership', errorMessage: error.message});
    }
    
  }

  async createAddOn(createAddOnDto: CreateAddOnDto): Promise<{ message: string; success: boolean; data: AddOn }> {
    try {
      const membership = await this.findMembershipById(createAddOnDto.membershipId);
      if(!membership) {
        throw new NotFoundException('Membership not found');
      }

    const addOn = this.addOnRepository.create(createAddOnDto);
    addOn.membership = membership;
    const savedAddOn = await this.addOnRepository.save(addOn);

  
    membership.add_ons = await this.addOnRepository.find({ where: { membership: { membershipId: membership.membershipId } } });
    await this.membershipRepository.save(membership);

    return {
      success: true,
      message: "Added succesfully",
      data: savedAddOn
    };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Membership not found');
      }
      throw new InternalServerErrorException({message: 'Failed to create add-on', errorMessage: error.message});
    }
  }


  async getMembershipsWithUpcomingDueDates(daysAhead: number): Promise<Membership[]> {
    
    try {
      const today = new Date();
    const upcomingDate = new Date();
    upcomingDate.setDate(today.getDate() + daysAhead);

    return this.membershipRepository.find({
      where: {
        dueDate: Between(today, upcomingDate),
      },
      relations: ['add_ons'],
    });
    } catch (error) {
      throw new InternalServerErrorException({message: 'Failed to get memberships with upcoming due dates', errorMessage: error.message});
    }
  }

  async findAllMemberships(): Promise<Membership[]> {
    return this.membershipRepository.find({ relations: ['add_ons'] });
  }

  async findMembershipById(id: number): Promise<Membership> {
    return this.membershipRepository.findOneByOrFail({ membershipId: id });
  }
}
