/* eslint-disable class-methods-use-this */
import Offer from '../../models/offer';
import User from '../../models/user';
import offerDao from '../../DAO/offerDAO';
import carDAO from '../../DAO/carDAO';
import { queryCarFvin, queryNumberOfYears, queryOfferAmount } from '../prompts/prompts';

class CustomerService {
  constructor(
    private offerData = offerDao,
  ) {}

  async calculateMonthlyPayment(amount: number, years: number): Promise<number> {
    let verfiyYears = years;
    let interest: number;
    if(verfiyYears < 1) {
      verfiyYears = 1;
    }
    if(verfiyYears === 1) {
      interest = 1;
    } else {
      interest = 0.05 / 12;
    }
    return amount * interest * verfiyYears;
  }

  async calculateRemainingPayments(years: number) {
    if(years < 1) {
      return 1;
    }
    return 12 * years;
  }

  async makeOffer(currentCustomer: User): Promise<void> {
    const fvin = await queryCarFvin();
    const offerAmount = Number(await queryOfferAmount());
    const years = Number(await queryNumberOfYears());
    const monthlyPayment = Number(await this.calculateMonthlyPayment(offerAmount, years));
    const remainingPayments = Number(await this.calculateRemainingPayments(years));
    const docid = Math.random().toString(36).substring(7);
    const offer = new Offer(
      fvin,
      docid,
      currentCustomer.username,
      offerAmount,
      monthlyPayment,
      remainingPayments,
      'Pending',
    );
    console.log(`   Sending Offer for: ${fvin}
    in the amount of ${offerAmount} to be paid in ${remainingPayments} payments of ${monthlyPayment}.\n`);
    try {
      await this.offerData.addOffer(offer);
    } catch(err) {
      console.log(err);
    }
  }

  async viewMyCars(currentCustomer: User): Promise<void> {
    const myCars = await carDAO.getCarsByOwner(currentCustomer.username);
    if(myCars.length === 0) {
      console.log('You do not have any cars yet...\n');
    } else {
      myCars.forEach((item) => {
        console.log(
          `      Model: ${item.model}
        FVIN: ${item.fvin}
        
        `,
        );
      });
    }
  }

  async viewRemainingPayments(currentCustomer: User): Promise<void> {
    const results = await offerDao.getRemainingPaymentsByOwner(currentCustomer.username);
    if(results.length === 0) {
      console.log('You do not have any payments due\n');
    } else {
      results.forEach((item) => {
        console.log(`FVIN: ${item.fvin} Document ID: ${item.docid} 
      Remaining Payments: ${item.remainingPayments} of ${item.monthlyPaymentAmount}\n`);
      });
    }
  }
}

export default new CustomerService();
