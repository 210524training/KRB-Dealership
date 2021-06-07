import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import log from '../utils/log';
import dynamo from '../dynamo/dynamo';
import Offer from '../models/offer';

class OfferDAO {
  constructor(
    private docClient = dynamo,
  ) {}

  async addOffer(offer: Offer): Promise<void> {
    const params: DocumentClient.PutItemInput = {
      TableName: 'offers',
      Item: offer,
      ReturnConsumedCapacity: 'TOTAL',

    };

    const result = await this.docClient.put(params).promise();
    if(result) {
      console.log('Sent\n');
    }

    log.debug(result);
  }

  async updateOfferToAccepted(fvin: string, docid: string | undefined): Promise<void> {
    const params: DocumentClient.UpdateItemInput = {
      TableName: 'offers',
      Key: {
        fvin,
        docid,
      },
      UpdateExpression: 'SET offerStatus = :s',
      ExpressionAttributeValues: {
        ':s': 'Accepted',
      },
      ReturnValues: 'UPDATED_NEW',
    };

    const result = await this.docClient.update(params).promise();
    if(result) {
      console.log('Offer was accepted');
    }
    log.debug(result);
  }

  async updateOfferToReject(fvin: string, docid: string): Promise<void> {
    const params: DocumentClient.UpdateItemInput = {
      TableName: 'offers',
      Key: {
        fvin,
        docid,
      },
      UpdateExpression: 'SET offerStatus = :s',
      ExpressionAttributeValues: {
        ':s': 'Rejected',
      },
      ReturnValues: 'UPDATED_NEW',
    };

    await this.docClient.update(params).promise();
  }

  async getRemainingPaymentsByOwner(owner: string): Promise<Offer[]> {
    const params: DocumentClient.QueryInput = {
      TableName: 'offers',
      IndexName: 'ownerindex',
      ProjectionExpression: '#id, #f, #mpa, #rp',
      KeyConditionExpression: '#ow = :o',
      ExpressionAttributeValues: {
        ':o': owner,
      },
      ExpressionAttributeNames: {
        '#ow': 'owner',
        '#id': 'docid',
        '#f': 'fvin',
        '#mpa': 'monthlyPaymentAmount',
        '#rp': 'remainingPayments',
      },
    };

    const data = await this.docClient.query(params).promise();

    if(data.Items) {
      return data.Items as Offer[];
    }
    return [];
  }

  async getPendingOffersToDelete(fvin: string): Promise<Offer[]> {
    const params: DocumentClient.ScanInput = {
      TableName: 'offers',
      FilterExpression: '#os = :stat AND #v = :v',
      ExpressionAttributeNames: {
        '#os': 'offerStatus',
        '#v': 'fvin',
      },
      ExpressionAttributeValues: {
        ':stat': 'Pending',
        ':v': fvin,
      },
    };
    const results = await this.docClient.scan(params).promise();
    if(results.Items) {
      return results.Items as Offer[];
    }
    console.log('No pending offers to reject');
    return [];
  }

  async getPendingOffers(): Promise<Offer[]> {
    const params: DocumentClient.ScanInput = {
      TableName: 'offers',
      ProjectionExpression: '#os, fvin, docid, offerPrice, monthlyPaymentAmount, remainingPayments, #ow',
      FilterExpression: '#os = :status',
      ExpressionAttributeNames: {
        '#os': 'offerStatus',
        '#ow': 'owner',
      },
      ExpressionAttributeValues: {
        ':status': 'Pending',
      },
    };
    const results = await this.docClient.scan(params).promise();
    if(results.Items) {
      return results.Items as Offer[];
    }
    return [];
  }

  async getAllPayments(): Promise<Offer[]> {
    const params: DocumentClient.ScanInput = {
      TableName: 'offers',
      ProjectionExpression: 'docid, monthlyPaymentAmount, remainingPayments, #ow',
      FilterExpression: '#os = :status',
      ExpressionAttributeNames: {
        '#os': 'offerStatus',
        '#ow': 'owner',
      },
      ExpressionAttributeValues: {
        ':status': 'Accepted',
      },
    };
    const results = await this.docClient.scan(params).promise();
    if(results.Items) {
      return results.Items as Offer[];
    }
    return [];
  }
}

export default new OfferDAO();
