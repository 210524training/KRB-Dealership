export default class Car {
  constructor(
    public owner: string,
    public fvin: string = Math.random().toString(36).substring(7),
    public model: string,
    public tagPrice: number,
    public status: 'Available' | 'Pending' | 'Sold',
  ) {}
}
