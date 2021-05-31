export default class Car {
  constructor(
    public id: string = Math.random().toString(36).substring(7),
    private model: string,
    private price: number,
    private purchasePrice: number | null,
    private monthlyPayment: number,
    private remainingPayments: number | null,
    private status: 'Available' | 'Pending' | 'Sold',
  ) {}

  set setId(value: string) {
    this.id = value;
  }

  get getId() {
    return this.id;
  }

  set getModel(value: string) {
    this.model = value;
  }

  get getModel() {
    return this.model;
  }

  set setPrice(value: number) {
    this.price = value;
  }

  get getPrice() {
    return this.price;
  }

  set setPurchasePrice(value: number) {
    this.purchasePrice = value;
  }

  get getPurchasePrice() {
    return this.purchasePrice;
  }

  set setMonthlyPayment(value: number) {
    this.monthlyPayment = value;
  }

  get getMonthlyPayment() {
    return this.monthlyPayment;
  }

  set setRemainingPayments(value: number) {
    this.remainingPayments = value;
  }

  get getRemainingPayments() {
    return this.remainingPayments;
  }

  set setStatus(value: 'Available' | 'Pending' | 'Sold') {
    this.status = value;
  }

  get getStatus() {
    return this.status;
  }
}
