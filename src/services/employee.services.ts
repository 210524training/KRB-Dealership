import fs from 'fs';
import Offer from '../models/offer';

class EmployeeService {
  constructor(
        public offers: Offer[] = [],
  ) {}

  // acceptOffer(currentOffer: Offer): void {
  //   const isValidOffer = this.offers.find((offer) => offer === currentOffer);
  //   if(isValidOffer) {
  //     const offerRef = currentOffer;
  //     offerRef.car.status = 'Sold';
  //     offerRef.car.monthlyPayment = (currentOffer.offer / 24) * 0.05;
  //     offerRef.customer.customerCars.push(currentOffer.car);
  //     offerRef.offerStatus = 'Accepted';
  //     this.autoRejectOtherOffers(currentOffer);
  //   }
  // }

  // autoRejectOtherOffers(currentOffer: Offer): void {
  //   const allCurrentOffers = this.offers.filter(
  //     (offer) => offer.car.id === currentOffer.car.id,
  //   );
  //   if(allCurrentOffers) {
  //     const offersToReject = this.offers.filter(
  //       (offer) => offer.customer.id !== currentOffer.customer.id,
  //     );
  //     while(offersToReject) {
  //       const elementToRemove: Offer | undefined = offersToReject.pop();
  //       if(elementToRemove) {
  //         const index = this.offers.indexOf(elementToRemove);
  //         this.offers[index].offerStatus = 'Rejected';
  //       }
  //     }
  //   }
  // }

  rejectOffer(currentOffer: Offer): void {
    const isValidOffer = this.offers.find((offer) => offer === currentOffer);
    if(isValidOffer) {
      const offerRef = currentOffer;
      offerRef.offerStatus = 'Rejected';
    }
  }

  save(): void {
    const offersString = JSON.stringify(this.offers);
    fs.writeFileSync('offers.json', offersString);
  }

  async load(): Promise<void> {
    return new Promise<void>(
      (resolve, reject) => {
        fs.readFile('offers.json', (err, buffer) => {
          if(err) {
            reject();
          }

          this.offers = JSON.parse(buffer.toString());
          resolve();
        });
      },
    );
  }
}

export default new EmployeeService();
