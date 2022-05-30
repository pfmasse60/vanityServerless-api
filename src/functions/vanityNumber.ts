import {APIGatewayProxyHandler} from 'aws-lambda';
import Responses from '../common/API_Responses';
import {v4 as uuidv4} from 'uuid';
import Dynamo from '../common/API_Dynamodb';
const TABLE_NAME = process.env.tableName;


export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const vanityNumber = event.pathParameters?.number as string;

    try {
      await Dynamo.put(TABLE_NAME as string, {
          itemType: '406-328-3151',
          Id: uuidv4(),
      });
  } catch (e) {
      console.log(e.message);
  }

    return Responses._200(vanityNumber);
};
