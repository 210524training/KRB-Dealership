import carDAO from '../../DAO/carDAO';
import Car from '../../models/car';
import { queryCarFvin, queryCarModel, queryCarPrice } from '../prompts/prompts';

class Lot {
  constructor(
        public data = carDAO,
  ) {}

  async addCarToLot(): Promise<void> {
    const model = await queryCarModel();
    const tagPrice = await queryCarPrice();
    const newCar = new Car(
      'Lot',
      Math.random().toString(36).substring(7),
      model,
      tagPrice,
      'Available',
    );
    await this.data.addCar(newCar);
  }

  async removeCarFromLot(): Promise<void> {
    const carId = await queryCarFvin();
    const isCarInLot = await this.data.deleteCar(carId);
    if(isCarInLot) {
      console.log('Car was removed from the lot.\n');
    } else {
      console.log('Car not found\n');
    }
  }

  async viewCarsInLot(): Promise<void> {
    const cars = await this.data.getAllCars();
    cars.forEach((item) => {
      console.log(
        `      Model: ${item.model}
      FVIN: ${item.fvin}
      Price: ${item.tagPrice}
      Status: ${item.status}
      
      `,
      );
    });
  }
}

export default new Lot();
