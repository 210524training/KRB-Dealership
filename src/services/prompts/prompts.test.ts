import RandExp from 'randexp';
import * as prompts from './prompts';
import * as utils from '../../utils/inpututils';

describe('Within userService Module', () => {
  afterAll(() => {
    utils.rl.close();
  });

  describe('queryNumberOfYears', () => {
    test('Should return number of year from the user', async () => {
      const years = Number(new RandExp(/^[0-9]{2,}$/).gen());

      jest.spyOn(prompts, 'queryNumberOfYears').mockResolvedValueOnce(years);

      await expect(prompts.queryNumberOfYears()).resolves.toBe(years);
    });
  });

  describe('queryOfferAmount', () => {
    test('Should return amount for the offer from the user', async () => {
      const amount = Number(new RandExp(/^[0-9]{2,}$/).gen());

      jest.spyOn(prompts, 'queryOfferAmount').mockResolvedValueOnce(amount);

      await expect(prompts.queryOfferAmount()).resolves.toBe(amount);
    });
  });

  describe('queryCarModel', () => {
    test('Should return model of car from the user', async () => {
      const model = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();

      jest.spyOn(prompts, 'queryCarModel').mockResolvedValueOnce(model);

      await expect(prompts.queryCarModel()).resolves.toBe(model);
    });
  });

  describe('queryCarPrice', () => {
    test('Should return price of car from the user', async () => {
      const price = Number(new RandExp(/^[0-9]{2,}$/).gen());

      jest.spyOn(prompts, 'queryCarPrice').mockResolvedValueOnce(price);

      await expect(prompts.queryCarPrice()).resolves.toBe(price);
    });
  });

  describe('queryCarFvin', () => {
    test('Should return fvin of car from the user', async () => {
      const fvin = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();

      jest.spyOn(prompts, 'queryCarFvin').mockResolvedValueOnce(fvin);

      await expect(prompts.queryCarFvin()).resolves.toBe(fvin);
    });
  });

  describe('queryNewUsername', () => {
    test('Should return username of car from the user', async () => {
      const user = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();

      jest.spyOn(prompts, 'queryNewUsername').mockResolvedValueOnce(user);

      await expect(prompts.queryNewUsername()).resolves.toBe(user);
    });
  });

  describe('queryUsername', () => {
    test('Should return username of car from the user', async () => {
      const user = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();

      jest.spyOn(prompts, 'queryUsername').mockResolvedValueOnce(user);

      await expect(prompts.queryUsername()).resolves.toBe(user);
    });
  });

  describe('queryOfferId', () => {
    test('Should return offer ID of offer from the user', async () => {
      const id = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();

      jest.spyOn(prompts, 'queryOfferId').mockResolvedValueOnce(id);

      await expect(prompts.queryOfferId()).resolves.toBe(id);
    });
  });

  describe('confirmPassword', () => {
    test('Should confirm password matches previous input', async () => {
      const password = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();

      jest.spyOn(prompts, 'confirmPassword').mockResolvedValueOnce(true);

      await expect(prompts.confirmPassword(password)).resolves.toBe(true);
    });
  });

  describe('queryPassword', () => {
    test('Should return offer ID of offer from the user', async () => {
      const password = new RandExp(/^[a-zA-Z0-9]{2,}$/).gen();

      jest.spyOn(prompts, 'queryPassword').mockResolvedValueOnce(password);

      await expect(prompts.queryPassword()).resolves.toBe(password);
    });
  });
});
