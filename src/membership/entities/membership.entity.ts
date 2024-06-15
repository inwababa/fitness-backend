import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AddOn } from './adds-on.entity';
import { Invoice } from '../../billing/entities/billing.entity';

@Entity()
export class Membership {
    @PrimaryGeneratedColumn()
    membershipId: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    membershipType: string;

    @Column()
    startDate: Date;

    @Column({ nullable: true })
    dueDate: Date;

    @Column('decimal')
    totalAmount: number;

    @Column()
    email: string;

    @Column({ default: true })
    isFirstMonth: boolean;

    @OneToMany(() => AddOn, addOn => addOn.membership, { cascade: true })
    add_ons: AddOn[];

    @OneToMany(() => Invoice, invoice => invoice.membership)
    invoices: Invoice[];
}
