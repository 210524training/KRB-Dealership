import Car from './car';
import Customer from './customer';

export default class Offer {
  constructor(
    private id: string = Math.random().toString(36).substring(7),
    public customer: Customer,
    public car: Car,
    private offer: number,
    public offerStatus: 'Pending' | 'Accepted' | 'Rejected',
  ) {}

  get getId() {
    return this.id;
  }

  set setOffer(value: number) {
    this.offer = value;
  }

  get getOffer() {
    return this.offer;
  }

  set setOfferStatus(value: 'Pending' | 'Accepted' | 'Rejected') {
    this.offerStatus = value;
  }
}
