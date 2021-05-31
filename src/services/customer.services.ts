/* eslint-disable class-methods-use-this */
import fs from 'fs';
import Car from '../models/car';
import Customer from '../models/customer';
import Lot from '../models/lot';
import Offer from '../models/offer';
import { rl } from './input.service';
import EmployeeService from './employee.services';

class CustomerService {
  constructor(
        public customers: Customer[] = [],
  ) {}

  findByUsername(username: string): Customer | undefined {
    return this.customers.find((customer) => customer.username === username);
  }

  register(currentCustomer: Customer): void {
    if(!this.findByUsername(currentCustomer.username)) {
      this.customers.push(currentCustomer);
    }
    this.save();
    console.log(
      '\nRegister successful please log in.\n',
    );
  }

  async checkLoginCredentials(username: string, password: string): Promise<Customer> {
    let isValidUsername: Customer | undefined;
    let isValidPassword: boolean;
    return new Promise<Customer>(
      (resolve, reject) => {
        isValidUsername = this.customers.find(
          (customer) => customer.username === username,
        );
        if(isValidUsername) {
          isValidPassword = isValidUsername.password === password;
          if(isValidUsername && isValidPassword) {
            resolve(isValidUsername);
          } else {
            console.log('Incorrect');
            reject();
          }
        }
      },
    );
  }

  save(): void {
    const customersString = JSON.stringify(this.customers);
    fs.writeFileSync('customers.json', customersString);
  }

  async load(): Promise<void> {
    return new Promise<void>(
      (resolve, reject) => {
        fs.readFile('customers.json', (err, buffer) => {
          if(err) {
            reject();
          }

          this.customers = JSON.parse(buffer.toString());
          resolve();
        });
      },
    );
  }

  async queryCarId(): Promise<string> {
    return new Promise<string>((resolve) => {
      rl.question(
        'Enter the id of the car you want to make a offer on:\n',
        (answer) => { resolve(answer); },
      );
    });
  }

  async queryOfferAmount(): Promise<number> {
    return new Promise<number>((resolve) => {
      rl.question(
        'How much is the offer?\n',
        (answer) => { resolve(Number(answer)); },
      );
    });
  }

  async makeOffer(currentCustomer: Customer): Promise<void> {
    if(Lot.carsLot) {
      const carId = await this.queryCarId();
      const offerAmount = await this.queryOfferAmount();
      EmployeeService.offers.push(new Offer(
        Math.random().toString(36).substring(7),
        currentCustomer,
        Lot.findByCarId((carId)),
        offerAmount,
        'Pending',
      ));
    } else {
      console.log('There are no cars available to make an offer on');
      throw new Error('Failed to make an offer');
    }
  }

  viewMyCars(currentCustomer: Customer): void {
    console.log(currentCustomer.customerCars);
  }

  viewRemainingPayments(currentCar: Car): void {
    console.log(currentCar.remainingPayments);
  }
}

export default new CustomerService();
