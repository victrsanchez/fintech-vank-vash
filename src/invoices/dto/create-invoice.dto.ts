export class CreateInvoiceDto {    
    invoiceId: number;
    vendorId: number;
    invoiceNumber: string;
    invoiceDate: Date;
    invoiceTotal: number;
    paymentTotal: number;
    creditTotal: number;
    bankId: number;
    invoiceDueDate: Date;
    paymentDate: Date;
}
