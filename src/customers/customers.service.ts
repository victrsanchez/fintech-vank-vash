import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {


  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}


  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.customerRepository.save({ ...createCustomerDto});
      return { message : 'Registro creado correrctamente' }
    } catch (error) {
      throw new Error(`{message : ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.customerRepository.find();
    } catch (error) {
      throw new Error(`{message : ${error.message}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.customerRepository.findOne(id);
    } catch (error) {
      throw new Error(`{message : ${error.message}`);
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      const customer = await this.customerRepository.findOne(id);
      if(!customer) throw new Error(`{message : El cliente no existe`);      
      await this.customerRepository.update(id,{...updateCustomerDto})
      return { message : 'Información actualizada correctamente' }
    } catch (error) {
      throw new Error(`{message : ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      const customer = await this.customerRepository.findOne(id);
      if(!customer) throw new Error(`{message : El cliente no existe`);
      return await this.customerRepository.remove(customer);
    } catch (error) {
      throw new Error(`{message : ${error.message}`);
    }
  }
}
