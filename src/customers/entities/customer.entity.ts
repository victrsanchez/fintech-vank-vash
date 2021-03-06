import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    companyName: string;
    
    @Column()
    internalCode : string;

    @Column()
    idTributario : string;

    @Column()
    currency: string;

    @Column()
    apiMonthlyQuota: number;
}
