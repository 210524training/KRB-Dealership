export default class Offer {
  constructor(
    public fvin: string,
    public docid: string,
    public owner: string,
    public offerPrice: number,
    public monthlyPaymentAmount: number,
    public remainingPayments: number,
    public offerStatus: 'Pending' | 'Accepted' | 'Rejected',
  ) {}
}
