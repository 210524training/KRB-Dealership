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

  findByCarId(id: string): Car | undefined {
    return this.carsLot.find((car) => car.id === id);
  }

  removeCarFromLot(currentCar: Car): void {
    const isCarInLot = this.carsLot.findIndex((car) => currentCar === car);
    if(isCarInLot) {
      this.carsLot.splice(isCarInLot, 1);
    }
  }

  async viewCarsInLot(): Promise<void> {
    if(this.carsLot) {
      return this.carsLot.forEach((car) => console.log(
        `Model: ${car.model} | Price: ${car.price} | status: ${car.status}\n`,
      ));
    }
    return console.log('\nThere are no cars in the lot.\n');
  }

  save(): void {
    const customersString = JSON.stringify(this.carsLot);
    fs.writeFileSync('carsLot.json', customersString);
  }

  async load(): Promise<void> {
    return new Promise<void>(
      (resolve, reject) => {
        fs.readFile('carsLot.json', (err, buffer) => {
          if(err) {
            reject();
          }

          this.carsLot = JSON.parse(buffer.toString());
          resolve();
        });
      },
    );
  }
}

export default new Lot();
