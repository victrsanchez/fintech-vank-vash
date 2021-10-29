import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customers/entities/customer.entity';
import { InvoicesModule } from './invoices/invoices.module';
import { Invoice } from './invoices/entities/invoice.entity';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    CustomersModule,
    InvoicesModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'fintechvank',
      entities: [Customer,Invoice],
      synchronize: true,
    }),
    ScheduleModule.forRoot()    
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
