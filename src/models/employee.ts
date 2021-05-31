import User from './user';

export default class Employee extends User {
  constructor(
    public id: string = Math.random().toString(36).substring(7),
    username: string,
    password: string,
    public title: 'employee',
  ) {
    super(username, password);
  }
}
