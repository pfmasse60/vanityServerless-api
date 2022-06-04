// import {APIGatewayProxyHandler} from 'aws-lambda';
import Responses from '../common/API_Responses';
import {v4 as uuidv4} from 'uuid';
import Dynamo from '../common/API_Dynamodb';
const TABLE_NAME = process.env.tableName;

export interface VanityNumbers {
  vanity1: string,
  vanity2: string,
  vanity3: string,
  vanity4: string,
  vanity5: string
}

export interface ResultMap {
  vanity1: string,
  vanity2: string,
  vanity3: string
}

export const handler = async (event: { pathParameters: { number: string; }; }, _context: any, callback: (arg0: any, arg1: ResultMap) => void) => {
    
    if (!event.pathParameters || !event.pathParameters.number) {
      return Responses._400({message: 'Missing phone number from path'})
    }

    const v:VanityNumbers = {
      vanity1: '1-800-FLOWERS',
      vanity2: '1-800-PROGRESSIVE',
      vanity3: '1-800-4YOUANDME',
      vanity4: '1-800-WORK4YOU',
      vanity5: '1-800-SENDME1',
    }
    
    const phoneNumber = event.pathParameters?.number as string;

    try {
      await Dynamo.put(TABLE_NAME as string, {
          Id: uuidv4(),
          phoneNumber: phoneNumber,
          vanity1: v.vanity1,
          vanity2: v.vanity2,
          vanity3: v.vanity3,
          vanity4: v.vanity4,
          vanity5: v.vanity5,
      });
  } catch (e) {
      console.log(e.message);
  }
  const resultMap:ResultMap = {
      vanity1: v.vanity1,
      vanity2: v.vanity2,
      vanity3: v.vanity3
    }
  callback(null, resultMap);
    
}