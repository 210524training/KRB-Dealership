import RandExp from 'randexp';
import User from '../../models/user';
import * as prompts from '../prompts/prompts';
import * as utils from '../../utils/inpututils';
import UserService from './userService';

describe('Within userService Module', () => {
  afterAll(() => {
    utils.rl.close();
  });

  describe('login', () => {
    test('should return User', async () => {
      const username = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();
      const password = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();
      const user = new User('Test', 'password', 'Customer');

      jest.spyOn(prompts, 'queryUsername').mockResolvedValueOnce(username);
      jest.spyOn(prompts, 'queryPassword').mockResolvedValueOnce(password);
      jest.spyOn(UserService, 'checkLoginCredentials').mockResolvedValueOnce(user);

      await expect(UserService.login()).resolves.toBeInstanceOf(User);
    });
  });
});
