/**
 *
 *  Processes inputs recieved from the user.
 */

import CustomerService from '../customer/customerServices';
import EmployeeService from '../employee/employeeServices';
import {
  customerPrompt, employeePrompt, initialPrompt,
} from '../prompts/prompts';
import UserService from '../user/userService';
import Lot from '../lot/lot';
import { exit } from '../../utils/inpututils';
import User from '../../models/user';

let currentUser: User | undefined;

export default async function receiveUserSelection(): Promise<void> {
  let response: string;
  if(!currentUser) {
    console.log(currentUser, 'TESTING *********************');
    response = await initialPrompt();

    switch (response) {
    case '0':
      await UserService.attemptRegister();
      break;
    case '1':
      currentUser = await UserService.login();
      break;
    case 'q':
      exit();
      break;
    default:
      console.log('Invalid Selection\n');
    }
  } else if(currentUser.role === 'Customer') {
    response = await customerPrompt();

    switch (response) {
    case '1':
      await Lot.viewCarsInLot();
      break;
    case '2':
      if(currentUser) {
        await CustomerService.viewMyCars(currentUser);
      }
      break;
    case '3':
      if(currentUser) {
        await CustomerService.makeOffer(currentUser);
      }
      break;
    case '4':
      await CustomerService.viewRemainingPayments(currentUser);
      break;
    case '5':
      currentUser = undefined;
      break;
    case 'q':
      exit();
      break;
    default:
      throw new Error('Invalid answer');
    }
  } else if(currentUser.role === 'Employee') {
    response = await employeePrompt();

    switch (response) {
    case '1':
      await Lot.addCarToLot();
      break;
    case '2':
      await EmployeeService.viewPendingOffers();
      break;
    case '3':
      await EmployeeService.acceptOffer();
      break;
    case '4':
      await EmployeeService.rejectOffer();
      break;
    case '5':
      await Lot.removeCarFromLot();
      break;
    case '6':
      await EmployeeService.viewPendingOffers();
      break;
    case '7':
      await Lot.viewCarsInLot();
      break;
    case '8':
      currentUser = await UserService.login();
      break;
    case 'q':
      exit();
      break;
    default:
      throw new Error('Invalid answer');
    }
  }
}
