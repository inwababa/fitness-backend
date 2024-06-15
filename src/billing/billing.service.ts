import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { Invoice } from './entities/billing.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddOn } from 'src/membership/entities/adds-on.entity';
import { randomBytes } from 'crypto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { Cron } from '@nestjs/schedule';
import { MembershipService } from 'src/membership/membership.service';
import { EmailService } from 'src/email.service';

@Injectable()
export class BillingService {

  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(AddOn)
    private addOnRepository: Repository<AddOn>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    private readonly membershipService: MembershipService,
    private readonly emailService: EmailService
    
  ) {}

  async createFirstMonthInvoice(membership: Membership): Promise<Invoice> {
    try {
      const invoiceUid = randomBytes(4).toString('hex');
    const totalAmount = membership.totalAmount + membership.add_ons.reduce((sum, addOn) => sum + addOn.monthlyAmount, 0);
    const invoice = this.invoiceRepository.create({
      invoiceDateTime: new Date(),
      totalAmount: totalAmount,
      invoiceUID: invoiceUid,
    });
    invoice.membership = membership
    const savedInvoice = await this.invoiceRepository.save(invoice);
    membership.invoices = await this.invoiceRepository.find({ where: { membership: { membershipId: membership.membershipId } } });
    await this.membershipRepository.save(membership);
    return savedInvoice;
    } catch (error) {
      throw new InternalServerErrorException({message: 'Error generating first monthly invoice', errorMessage: error.message});
    }
  }



  async createMonthlyInvoice(membership: Membership, addOn: AddOn): Promise<Invoice> {
    try {
      const invoiceUid = randomBytes(4).toString('hex'); 
    const invoice = this.invoiceRepository.create({
      invoiceDateTime: new Date(),
      totalAmount: addOn.monthlyAmount,
      invoiceUID: invoiceUid,
    });
    invoice.membership = membership
    const savedInvoice = await this.invoiceRepository.save(invoice);
    membership.invoices = await this.invoiceRepository.find({ where: { membership: { membershipId: membership.membershipId } } });
    await this.membershipRepository.save(membership);
    return savedInvoice;
    } catch (error) {
      throw new InternalServerErrorException({message: 'Error generating monthly invoice', errorMessage: error.message});
    }
  }

  async findInvoiceById(id: number): Promise<Invoice> {
    return this.invoiceRepository.findOne({ relations: ['membership'] });
  }


  //@Cron('0 0 * * *') // Run daily at midnight
  @Cron('0 0 * * *')
  async handleCron() {
    try {
      
      const today = new Date();
    const memberships = await this.membershipService.getMembershipsWithUpcomingDueDates(7);
    
    for (const membership of memberships) {
      if (membership.isFirstMonth) {
        const reminderDate = new Date(membership.dueDate);
        reminderDate.setDate(reminderDate.getDate() - 7);
        if (today >= reminderDate) {
         const invoice =  await this.createFirstMonthInvoice(membership)
          await this.emailService.sendFirstMonthEmail(membership, invoice);
        }
      } else {
        const addOns = membership.add_ons;
        for (const addOn of addOns) {
          const monthlyDueDate = new Date(addOn.dueDate);
          if (today >= monthlyDueDate) {
            
            const invoice =  await this.createMonthlyInvoice(membership, addOn)
            await this.emailService.sendMonthlyEmail(membership, addOn, invoice);
          }
        }
      }
    }
    } catch (error) {
      console.error('Error processing cron job:', error.message);
    }
    
  }


}
