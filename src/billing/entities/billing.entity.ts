import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Membership } from '../../membership/entities/membership.entity';

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    invoiceId: number;

    @ManyToOne(() => Membership, membership => membership.invoices)
    membership: Membership;

    @Column('timestamp')
    invoiceDateTime: Date;

    @Column('decimal')
    totalAmount: number;

    @Column('char', { length: 8 })
    invoiceUID: string;
}
