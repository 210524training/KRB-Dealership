import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import log from '../utils/log';
import dynamo from '../dynamo/dynamo';
import Car from '../models/car';

class CarDAO {
  constructor(
    private docClient = dynamo,
  ) {}

  async updateCarOwner(fvin: string, user: string): Promise<void> {
    const params: DocumentClient.UpdateItemInput = {
      TableName: 'cars',
      Key: {
        fvin,
      },
      UpdateExpression: 'SET #ow = :u',
      ExpressionAttributeValues: {
        ':u': user,
      },
      ExpressionAttributeNames: {
        '#ow': 'owner',
      },
    };

    await this.docClient.update(params).promise();
  }

  async getCarsByOwner(user: string): Promise<Car[]> {
    const params: DocumentClient.ScanInput = {
      TableName: 'cars',
      ProjectionExpression: '#f, #m',
      FilterExpression: '#o = :ow',
      ExpressionAttributeNames: {
        '#f': 'fvin',
        '#m': 'model',
        '#o': 'owner',
      },
      ExpressionAttributeValues: {
        ':ow': user,
      },
    };

    const data = await this.docClient.scan(params).promise();

    if(data.Items) {
      return data.Items as Car[];
    }
    return [];
  }

  async getCarByFvin(fvin: string): Promise<Car | undefined> {
    const params: DocumentClient.GetItemInput = {
      TableName: 'cars',
      Key: {
        fvin,
      },
      ProjectionExpression: '#f, #m, #tp, #s',
      ExpressionAttributeNames: {
        '#f': 'fvin',
        '#m': 'model',
        '#tp': 'tagPrice',
        '#s': 'status',
      },
    };

    const data = await this.docClient.get(params).promise();
    return data.Item as Car | undefined;
  }

  async addCar(car: Car): Promise<void> {
    const params: DocumentClient.PutItemInput = {
      TableName: 'cars',
      Item: car,
      ReturnConsumedCapacity: 'TOTAL',
      ConditionExpression: 'fvin <> :fvin',
      ExpressionAttributeValues: {
        ':fvin': car.fvin,
      },
    };

    const result = await this.docClient.put(params).promise();

    log.debug(result);
  }

  async deleteCar(fvin: string): Promise<boolean> {
    const params: DocumentClient.DeleteItemInput = {
      TableName: 'cars',
      Key: {
        fvin,
      },
    };

    try {
      const result = await this.docClient.delete(params).promise();

      log.debug(result);
      return true;
    } catch(error) {
      log.error(error);
      return false;
    }
  }

  async getAllCars(): Promise<Car[]> {
    const params: DocumentClient.ScanInput = {
      TableName: 'cars',
      ProjectionExpression: '#o, #f, #m, #tp, #s',
      ExpressionAttributeNames: {
        '#o': 'owner',
        '#f': 'fvin',
        '#m': 'model',
        '#tp': 'tagPrice',
        '#s': 'status',
      },
      FilterExpression: '#o = :own',
      ExpressionAttributeValues: {
        ':own': 'Lot',
      },
    };

    const results = await this.docClient.scan(params).promise();

    if(results.Items) {
      return results.Items as Car[];
    }
    return [];
  }
}

export default new CarDAO();
