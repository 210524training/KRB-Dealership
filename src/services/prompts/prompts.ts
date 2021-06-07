import { rl } from '../../utils/inpututils';

export function queryNumberOfYears(): Promise<number> {
  return new Promise<number>((resolve) => {
    rl.question(
      'How many years to pay loan?',
      (answer: string) => { resolve(Number(answer)); },
    );
  });
}

export function queryOfferAmount(): Promise<number> {
  return new Promise<number>((resolve) => {
    rl.question(
      'How much is the offer?',
      (answer: string) => { resolve(Number(answer)); },
    );
  });
}

export function queryCarModel(): Promise<string> {
  return new Promise<string>((resolve) => {
    rl.question(
      'Enter the Make and Model of the car:\n',
      (answer: string) => { resolve(answer); },
    );
  });
}

export function queryCarPrice(): Promise<number> {
  return new Promise<number>((resolve) => {
    rl.question(
      'Enter the listing price of the car:\n',
      (answer: string) => { resolve(Number(answer)); },
    );
  });
}

export function queryCarFvin(): Promise<string> {
  return new Promise<string>((resolve) => {
    rl.question(
      'Enter the FVIN of the car:\n',
      (answer: string) => { resolve(answer); },
    );
  });
}

export function queryNewUsername(): Promise<string> {
  return new Promise<string>(
    (resolve) => {
      rl.question(
        'What is the buyer\'s username? ',
        (answer) => resolve(answer),
      );
    },
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

export function queryOfferId(): Promise<string> {
  return new Promise<string>((resolve) => {
    rl.question(
      'Enter the Offer ID: ',
      (answer) => resolve(answer),
    );
  });
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

export function initialPrompt(): Promise<string> {
  return new Promise((resolve, reject) => {
    rl.question(
      `Welcome to the CLI Dealership
  
        Please sign up or sign in.
        0. Register
        1. Login
        q. exit\n`,
      (answer: string) => {
        if(['0', '1', 'q'].includes(answer)) {
          resolve(answer);
        } else {
          reject();
        }
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
          5. login as another user
          q. exit\n`,
        (answer: string) => {
          let isValid = false;
          if((!Number.isNaN(Number(answer)) && (Number(answer) <= 5) && (Number(answer) >= 1)) || (answer === 'q')) {
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

export async function employeePrompt(): Promise<string> {
  return new Promise<string>(
    (resolve, reject) => {
      rl.question(
        `What will you like to do?
          1. Add car to lot
          2. View Pending Offers
          3. Accept an offer
          4. Reject an offers
          5. Remove Car from lot
          6. View all payments
          7. View cars in lot
          8. login as another user
          q. exit\n`,
        (answer: string) => {
          let isValid = false;
          if((!Number.isNaN(Number(answer)) && (Number(answer) <= 8) && (Number(answer) >= 1)) || (answer === 'q')) {
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
