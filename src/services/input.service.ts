/* eslint-disable @typescript-eslint/no-use-before-define */
import readline from 'readline';
import Car from '../models/car';
import Customer from '../models/customer';
import Lot from '../models/lot';
import CustomerService from './customer.services';
import EmployeeService from './employee.services';

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function exit() {
  CustomerService.save();
  EmployeeService.save();
  Lot.save();
  process.exit();
}

let currentUser: Customer | undefined;

export function initialPrompt(): Promise<string> {
  return new Promise((resolve, reject) => {
    rl.question(
      `Welcome to the CLI Dealership

      Please sign up or sign in.
      0. Register
      1. Login
      2. Employee Login
      q. exit\n`,
      (answer: string) => {
        let isValid = false;
        if((!Number.isNaN(Number(answer)) && (Number(answer) <= 2) && (Number(answer) >= 0)) || (answer === 'q')) {
          isValid = true;
        }

        if(isValid) {
          resolve(answer);
        }

        reject();
      },
    );
  });
}

export async function customerPrompt(): Promise<string> {
  return new Promise<string>(
    (resolve, reject) => {
      rl.question(
        `What will you like to do?
        1. View cars in the lot
        2. View owned carsLot
        3. Make offer for car
        4. View remaining payments for car
        q. exit\n`,
        (answer: string) => {
          let isValid = false;
          if((!Number.isNaN(Number(answer)) && (Number(answer) <= 4) && (Number(answer) >= 1)) || (answer === 'q')) {
            isValid = true;
          }

          if(isValid) {
            resolve(answer);
          }

          reject();
        },
      );
    },
  );
}

export function employeePrompt(): Promise<string> {
  return new Promise<string>(
    (resolve) => resolve(''),
  );
}

export function queryUsername(): Promise<string> {
  return new Promise<string>(
    (resolve) => {
      rl.question(
        'What is your username? ',
        (answer) => resolve(answer),
      );
    },
  );
}

export function confirmPassword(password: string): Promise<boolean> {
  return new Promise<boolean>(
    (resolve) => {
      rl.question(
        'Please confirm your password: ',
        (answer) => resolve(answer === password),
      );
    },
  );
}

export async function queryPassword(): Promise<string> {
  const password = await new Promise<string>(
    (resolve) => {
      rl.question(
        'What is your password? ',
        (answer) => resolve(answer),
      );
    },
  );

  if(await confirmPassword(password)) {
    return password;
  }

  console.log('Passwords did not match');
  throw new Error('Promise did not match');
}

export async function attemptRegister(): Promise<void> {
  const id = Math.random().toString(36).substring(7);
  const username = await queryUsername();

  if(CustomerService.findByUsername(username)) {
    console.log('The provided username is already taken');
    throw new Error('Username already taken');
  }

  const password = await queryPassword();
  const customerCars: Car[] = [];

  CustomerService.register(new Customer(id, username, password, customerCars));
}

export async function loginCustomer(): Promise<void> {
  const username = await queryUsername();
  const password = await queryPassword();

  const signedInCustomer = await CustomerService.checkLoginCredentials(username, password);
  console.log('login customer', signedInCustomer);
  if(signedInCustomer) {
    currentUser = signedInCustomer;
    await receiveCustomerSelection();
  } else {
    throw new Error('No one signed in');
  }
}

export async function receiveCustomerSelection(): Promise<void> {
  let response: string = '';
  if(currentUser) {
    response = await customerPrompt();

    switch (response) {
    case '1':
      Lot.viewCarsInLot();
      await receiveCustomerSelection();
      break;
    case '2':
      if(currentUser) {
        CustomerService.viewMyCars(currentUser);
      }
      await receiveCustomerSelection();
      break;
    case '3':
      if(currentUser) {
        await CustomerService.makeOffer(currentUser);
        EmployeeService.save();
      }
      break;
    // case '4':
    //   CustomerService.viewRemainingPayments();
    case 'q':
      exit();
      break;
    default:
      throw new Error('Invalid answer');
    }
  }
}

export async function receiveUserSelection(): Promise<void> {
  const response: string = await initialPrompt();

  switch (response) {
  case '0':
    // Allow the User to register
    await attemptRegister();
    break;
  case '1':
    await loginCustomer();
    break;
  case '2':
    await employeePrompt();
    break;
  case 'q':
    exit();
    break;
    // etc
  default:
    console.log('Invalid Selection\n');
  }
}

export async function start() {
  await CustomerService.load();
  await EmployeeService.load();
  await Lot.load();
  console.log('Start', CustomerService.customers);
  console.log('Start', EmployeeService.offers);
  console.log('Start', Lot.carsLot);

  try {
    // eslint-disable-next-line no-constant-condition
    while(!currentUser) {
      console.log('while loop');
      // eslint-disable-next-line no-await-in-loop
      await receiveUserSelection();
      // eslint-disable-next-line no-empty
    }
    while(currentUser) {
      console.log(currentUser);
      // eslint-disable-next-line no-await-in-loop
      await receiveCustomerSelection();
    }
  } catch(error) {
    console.log('loop error', error);
  }
}
