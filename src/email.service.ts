import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();
import { MailtrapClient } from "mailtrap";
import { Membership } from './membership/entities/membership.entity';
import { Invoice } from './billing/entities/billing.entity';
import { AddOn } from './membership/entities/adds-on.entity';


const TOKEN = process.env.MAILTRAP_TOKEN;
const sender = { name: "Fitness+ Notification", email: 'no-reply@hochela.com' };

@Injectable()
export class EmailService {
  private mailtrapClient: MailtrapClient;

  constructor() {
    
    this.mailtrapClient = new MailtrapClient({ token: TOKEN });
  }

  async sendFirstMonthEmail(membership: Membership, invoice: Invoice): Promise<void> {

      try {
        const subject = `Fitness+ Membership Reminder - ${membership.membershipType}`;
        const message = `<!DOCTYPE html>
      <html>
          <p>Dear ${membership.firstName} ${membership.lastName},</p>
        
       <p> This is a reminder for your upcoming ${membership.membershipType} membership fee. The total amount due is ${invoice.totalAmount}. 
        This includes your first month's add-on service charges. Please find the invoice linked here: <a href="https://fitness+.com/${invoice.invoiceUID}">INVOICE</a>.

        Thank you,
        Fitness+ Team;
      </html>`;  
      await this.mailtrapClient.send({
        from: sender,
        to: [{email: membership.email}],
        subject: subject,
        html: message,
      });
    } catch (error) {
      throw new InternalServerErrorException({message: error.message});
    }
    }


    async sendMonthlyEmail(membership: Membership, addOn: AddOn, invoice: Invoice): Promise<void> {

        try {
          const subject = `Fitness+ Membership Reminder - ${membership.membershipType}`;
          const message = `<!DOCTYPE html>
        <html>
            <p>Dear ${membership.firstName} ${membership.lastName},</p>
          
         <p> This is a reminder for your upcoming monthly add-on service charge for ${addOn.serviceName}. The amount due is ${addOn.monthlyAmount}. 
         Please find the invoice linked here: <a href="https://fitness+.com/${invoice.invoiceUID}">INVOICE</a>.
  
          Thank you,
          Fitness+ Team;
        </html>`;  
        await this.mailtrapClient.send({
          from: sender,
          to: [{email: membership.email}],
          subject: subject,
          html: message,
        });
      } catch (error) {
        throw new InternalServerErrorException({message: error.message});
      }
      }

}