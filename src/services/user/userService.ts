import User from '../../models/user';
import UserDAO from '../../DAO/userDAO';
import { queryPassword, queryUsername } from '../prompts/prompts';

class UserService {
    public currentUser: User | undefined;

    public data = UserDAO;

    async login(): Promise<User | undefined> {
      const username = await queryUsername();
      const password = await queryPassword();

      const signedInCustomer = await this.checkLoginCredentials(username, password);
      if(signedInCustomer) {
        this.currentUser = signedInCustomer;
        console.log('\nWelcome, ', this.currentUser.username);
        return this.currentUser;
      }
      return undefined;
    }

    async attemptRegister(): Promise<void> {
      const username = await queryUsername();
      const checkUsername = await this.data.getByUsername(username);

      if(checkUsername) {
        throw new Error('Username already taken');
      }

      const password = await queryPassword();
      const role = 'Customer';

      await this.register(new User(username, password, role));
      this.login();
    }

    async register(currentUser: User): Promise<void> {
      await this.data.addNewUser(currentUser);
      console.log(
        '\nRegister successful please log in.\n',
      );
    }

    async checkLoginCredentials(username: string, password: string): Promise<User | undefined> {
      let found: User | undefined;
      try {
        found = await this.data.getByUsername(username);
        if(found?.username === username && found?.password === password) {
          return found;
        }
      } catch(err) {
        throw new Error('Credentials were incorrect');
      }
      return found;
    }
}

export default new UserService();
