import User from './user';
import Car from './car';

export default class Customer extends User {
  constructor(
    public id: string = Math.random().toString(36).substring(7),
    username: string,
    password: string,
    public customerCars: Car[],
  ) {
    super(username, password);
  }

  // set setId(id: string) {
  //   this.id = id;
  // }

  // get getId() {
  //   return this.id;
  // }

  // set setUsername(value: string) {
  //   this.username = value;
  // }

  // get getUsername() {
  //   return this.username;
  // }

  // set setPassword(value: string) {
  //   this.password = value;
  // }

  // get getPassword() {
  //   return this.password;
  // }
}
