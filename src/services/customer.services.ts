/* eslint-disable class-methods-use-this */
import fs from 'fs';
import inquirer from 'inquirer';
import Car from '../models/car';
import Customer from '../models/customer';
import Offer from '../models/offer';
import Lot from '../models/lot';
import EmployeeService from './employee.services';

class CustomerService {
  constructor(
        public customers: Customer[] = [],
  ) {}

  findByUsername(username: string): Customer | undefined {
    return this.customers.find((customer) => customer.getUsername === username);
  }

  register(currentCustomer: Customer): void {
    if(!this.findByUsername(currentCustomer.getUsername)) {
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

  makeOffer(currentCustomer: Customer): void {
    inquirer.prompt([
      {
        name: 'car',
        type: 'list',
        message: 'What is the car you want to make an offer on?\n',
        choices: Lot.viewCarsInLot,
      },
      {
        name: 'offer',
        type: 'input',
        message: 'What is the ID of the car you want to make an offer on?\n',
      },
    ]).then((answers: any) => EmployeeService.offers.push(
      new Offer(
        Math.random().toString(36).substring(7),
        currentCustomer,
        answers.car,
        answers.offer,
        'Pending',
      ),
    ));
  }

  viewMyCars(currentCustomer: Customer): void {
    console.log(currentCustomer.customerCars);
  }

  viewRemainingPayments(currentCar: Car): void {
    console.log(currentCar.getRemainingPayments);
  }
}

export default new CustomerService();
