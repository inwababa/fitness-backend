import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Membership } from './membership.entity';

@Entity()
export class AddOn {
    @PrimaryGeneratedColumn()
    addOnId: number;

    @ManyToOne(() => Membership, membership => membership.add_ons)
    membership: Membership;

    @Column()
    serviceName: string;

    @Column('decimal')
    monthlyAmount: number;

    @Column()
    dueDate: Date;
}
