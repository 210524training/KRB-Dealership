import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import log from '../utils/log';
import dynamo from '../dynamo/dynamo';
import User from '../models/user';

class UserDAO {
  constructor(
    private docClient = dynamo,
  ) {}

  async getByUsername(username: string): Promise<User | undefined> {
    const params: DocumentClient.GetItemInput = {

      TableName: 'users',
      Key: {
        username,
      },
      ProjectionExpression: '#u, #p, #r',
      ExpressionAttributeNames: {
        '#u': 'username',
        '#p': 'password',
        '#r': 'role',
      },
    };

    const data = await this.docClient.get(params).promise();
    log.debug(data);
    return data.Item as User | undefined;
  }

  async addNewUser(user: User): Promise<boolean> {
    const params: DocumentClient.PutItemInput = {

      TableName: 'users',
      Item: user,
    };
    try {
      const result = await this.docClient.put(params).promise();
      log.debug(result);
      return true;
    } catch(error) {
      return false;
    }
  }
}

export default new UserDAO();
