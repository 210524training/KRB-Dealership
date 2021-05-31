import User from './user';

export default class Employee extends User {
  constructor(
      private id: string = Math.random().toString(36).substring(7),
      username: string,
      password: string,
    private title: 'employee',
  ) {
    super(username, password);
  }
}
