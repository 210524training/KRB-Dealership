import Car from './car';
import Customer from './customer';

export default class Offer {
  constructor(
    public id: string = Math.random().toString(36).substring(7),
    public customer: Customer,
    public car: Car | undefined,
    public offer: number,
    public offerStatus: 'Pending' | 'Accepted' | 'Rejected',
  ) {}

  // get getId() {
  //   return this.id;
  // }

  // set setOffer(value: number) {
  //   this.offer = value;
  // }

  // get getOffer() {
  //   return this.offer;
  // }

  // set setOfferStatus(value: 'Pending' | 'Accepted' | 'Rejected') {
  //   this.offerStatus = value;
  // }
}
