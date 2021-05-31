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

export function customerPrompt(): Promise<string> {
  return new Promise<string>(
    (resolve, reject) => {
      rl.question(
        `What will you like to do?
        0. Go Back
        1. View cars in the lot
        2. View owned carsLot
        3. Make offer for car
        4. View remaining payments for car
        q. exit\n`,
        (answer: string) => {
          let isValid = false;
          if((!Number.isNaN(Number(answer)) && (Number(answer) <= 2) && (Number(answer) >= 0)) || (answer === 'q')) {
            isValid = true;
          }

          if(isValid) {
            switch (answer) {
            case '0':
              customerPrompt();
              break;
            case '1':
              Lot.viewCarsInLot();
              break;
            case '2':
              if(currentUser) {
                CustomerService.viewMyCars(currentUser);
              }
              break;
            case '3':
              if(currentUser) {
                CustomerService.makeOffer(currentUser);
              }
              EmployeeService.save();
              break;
            default:
              throw new Error('Invalid answer');
            }
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
    console.log(`\nWelcome ${currentUser.username}\n`);
    await customerPrompt();
  }
  console.log('\nCredentials were incorrect\nPlease try again...\n');
  await loginCustomer();
  throw new Error('Credentials were incorrect');
}

export async function receiveUserSelection(): Promise<void> {
  let response: string;
  if(!currentUser) {
    response = await initialPrompt();

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
}

export async function start() {
  await CustomerService.load();
  await EmployeeService.load();
  console.log('Start', CustomerService.customers);

  // eslint-disable-next-line no-constant-condition
  while(true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await receiveUserSelection();
    // eslint-disable-next-line no-empty
    } catch(error) {}
  }
}
