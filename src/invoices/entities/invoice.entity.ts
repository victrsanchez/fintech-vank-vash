import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invoice {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    invoiceId: number;

    @Column({ nullable: true })
    vendorId: number;

    @Column({ nullable: true })
    invoiceNumber: string;

    @Column({ nullable: true })
    invoiceDate: Date;

    @Column({ nullable: true })
    invoiceTotal: number;

    @Column({ nullable: true })
    paymentTotal: number;

    @Column({ nullable: true })
    creditTotal: number;

    @Column({ nullable: true })
    bankId: number;

    @Column({ nullable: true })
    invoiceDueDate: Date;

    @Column({ nullable: true })
    paymentDate: Date;

}
