import { Catch, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CsvParser } from 'nest-csv-parser';
import * as fs from 'fs';
import * as https from 'https';
import { Invoice } from './entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { FilterInvoiceDto } from './dto/filter-invoice.dto';

class InvoiceCSV {
  INVOICE_ID: string
  VENDOR_ID: string
  INVOICE_NUMBER: string
  INVOICE_DATE: string
  INVOICE_TOTAL: string
  PAYMENT_TOTAL: string
  CREDIT_TOTAL: string
  BANK_ID: string
  INVOICE_DUE_DATE: string
  PAYMENT_DATE: string
}



@Injectable()
export class InvoicesService {

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    private readonly csvParser: CsvParser
  ) {}


  async create(createInvoiceDto: CreateInvoiceDto) {
    try {
      await this.invoiceRepository.save({ ...createInvoiceDto })
      return { message : 'Invoice creada correctamente' };
    } catch (error) {
      throw new Error(`{message : ${error.message}`);
    }
  }

  async findAll(filterInvoiceDto : FilterInvoiceDto) {
    try {

      const {vendorId, startDate, endDate} = filterInvoiceDto;

      let invoicesQuery = this.invoiceRepository
                          .createQueryBuilder("invoice");

      if(vendorId) invoicesQuery.andWhere(`invoice.vendorId =:vendorId `,{vendorId});
      if(startDate) invoicesQuery.andWhere(`invoice.invoiceDate >=:startDate `,{startDate});
      if(endDate) invoicesQuery.where(`invoice.vendorId =:endDate `,{endDate});
      return await invoicesQuery.getMany();
    } catch (error) {
      throw new Error(`{message : ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.invoiceRepository.findOne(id);
    } catch (error) {
      throw new Error(`{message : ${error.message}`);
    }
  }

  async findByInoviceId(invoiceId: number) {
    try {
      return await this.invoiceRepository.findOne({invoiceId});
    } catch (error) {
      throw new Error(`{message : ${error.message}`);
    }
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    try {
      const invoice = await this.invoiceRepository.findOne(id);
      if(!invoice) throw new Error(`{message : La factura no existe}`);      
      await this.invoiceRepository.update(id,{...updateInvoiceDto})
      return { message : 'Información actualizada correctamente' }
    } catch (error) {
      throw new Error(`{message : ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const invoice = await this.invoiceRepository.findOne(id);
      if(!invoice) throw new Error(`{message : La factura no existe}`);
      return await this.invoiceRepository.remove(invoice);
    } catch (error) {
      throw new Error(`{message : ${error.message}`);
    }
  }

  @Cron('* * 10 * * *')
  async getCsvData(){

    console.log('obtiene de un archivo csv la información de invoices');

    const readCSV = () => new Promise(((resolve, reject) => {
      const file = fs.createWriteStream("dataa.csv");
      https.get("https://gist.githubusercontent.com/rogelio-meza-t/f70a484ec20b8ea43c67f95a58597c29/raw/41f289c605718e923fc1fad0539530e4d0413a90/invoices.csv", response => {
        var stream = response.pipe(file);
        resolve(stream);
      });

    }));

    await readCSV();

    const stream = fs.createReadStream("dataa.csv");
    const invoicesCSV = await this.csvParser.parse(stream, InvoiceCSV,null,null,{ separator: ',' }); 

    const currentInvoices  = await this.findAll({ vendorId : null, startDate : null, endDate :null });

    invoicesCSV.list.forEach( item =>  {

      const invoice =  currentInvoices.find( x => x.invoiceId == +item.INVOICE_ID )
      
      if(invoice){
        this.update(invoice.id,{  invoiceId: item.INVOICE_ID, vendorId:item.VENDOR_ID , invoiceNumber:item.INVOICE_NUMBER ,invoiceDate: item.INVOICE_DATE,invoiceTotal:item.INVOICE_TOTAL ,paymentTotal: item.PAYMENT_TOTAL, creditTotal: item.PAYMENT_TOTAL,bankId:item.BANK_ID ,invoiceDueDate:item.INVOICE_DUE_DATE,paymentDate:item.PAYMENT_DATE });
      }
      else{          
        this.create({  invoiceId: item.INVOICE_ID, vendorId:item.VENDOR_ID , invoiceNumber:item.INVOICE_NUMBER ,invoiceDate: item.INVOICE_DATE,invoiceTotal:item.INVOICE_TOTAL ,paymentTotal: item.PAYMENT_TOTAL, creditTotal: item.PAYMENT_TOTAL,bankId:item.BANK_ID ,invoiceDueDate:item.INVOICE_DUE_DATE,paymentDate:item.PAYMENT_DATE });
      }
      
    } );
  }

}
