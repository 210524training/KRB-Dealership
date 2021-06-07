import carDAO from '../../DAO/carDAO';
import offerDAO from '../../DAO/offerDAO';
import { queryCarFvin, queryOfferId, queryNewUsername } from '../prompts/prompts';

class EmployeeService {
  constructor(
    private data = offerDAO,
  ) {}

  async viewPendingOffers(): Promise<void> {
    const offers = await this.data.getPendingOffers();

    if(offers.length === 0) {
      console.log('There are no pending offers\n');
    } else {
      offers.forEach((item) => {
        if(item.offerStatus === 'Pending') {
          console.log(`
          Document ID:      ${item.docid},
          Name:             ${item.owner}
          FVIN:             ${item.fvin},
          Offer Total:      $${item.offerPrice},
          Monthly Payment:  $${item.monthlyPaymentAmount},
          Total Payments:   $${item.remainingPayments},
          Status:           ${item.offerStatus}
          
          `);
        }
      });
    }
  }

  async acceptOffer(): Promise<void> {
    const fvin = await queryCarFvin();
    const offerId = await queryOfferId();
    const owner = await queryNewUsername();
    await this.data.updateOfferToAccepted(fvin, offerId);
    await carDAO.updateCarOwner(fvin, owner);
    await this.autoRejectOtherOffers(fvin);
  }

  async autoRejectOtherOffers(fvin: string): Promise<void> {
    const offersToDelete = await this.data.getPendingOffersToDelete(fvin);
    offersToDelete.forEach(async (item) => {
      await this.data.updateOfferToReject(item.fvin, item.docid);
    });
  }

  async rejectOffer(): Promise<void> {
    const fvin = await queryCarFvin();
    const offerId = await queryOfferId();
    await this.data.updateOfferToReject(fvin, offerId);
  }

  async viewAllPayment(): Promise<void> {
    const allCarsWithPayments = await this.data.getAllPayments();
    allCarsWithPayments.forEach((item) => {
      // eslint-disable-next-line max-len
      console.log(`
      Document ID: ${item.docid} Customer: ${item.owner} Pay Amount: ${item.monthlyPaymentAmount} Remaining: ${item.remainingPayments}`);
    });
  }
}

export default new EmployeeService();
