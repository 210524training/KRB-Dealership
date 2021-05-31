import fs from 'fs';
import Car from './car';

class Lot {
  constructor(
        public carsLot: Car[] = [],
  ) {}

  addCarToLot(
    id: string,
    model: string,
    price: number,
    purchasePrice: number | null,
    monthlyPayment: number,
    remainingPayments: number | null,
    status: 'Available' | 'Pending' | 'Sold',
  ): void {
    const newCar = new Car(
      id,
      model,
      price,
      purchasePrice,
      monthlyPayment,
      remainingPayments,
      status,
    );
    this.carsLot.push(newCar);
    console.log('Car was added to the lot.\n');
  }

  removeCarFromLot(currentCar: Car): void {
    const isCarInLot = this.carsLot.findIndex((car) => currentCar === car);
    if(isCarInLot) {
      this.carsLot.splice(isCarInLot, 1);
    }
  }

  viewCarsInLot(): void {
    this.carsLot.forEach((car) => console.log(
      `Model: ${car.getModel} | Price: ${car.getPrice} | status: ${car.getStatus}\n`,
    ));
  }

  save(): void {
    const customersString = JSON.stringify(this.carsLot);
    fs.writeFileSync('carsLot.json', customersString);
  }
}

export default new Lot();
