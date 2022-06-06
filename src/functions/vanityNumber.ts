// import Responses from '../common/API_Responses';
import {v4 as uuidv4} from 'uuid';
import Dynamo from '../common/API_Dynamodb';
import createVanityNumbers from '../common/vanityCreator';
const TABLE_NAME = process.env.tableName;
import { ConnectContactFlowResult } from 'aws-lambda';

export const handler = async (event: { pathParameters: { phoneNumber: string; }; }, _context: any, callback: (arg0: any, arg1: ConnectContactFlowResult) => void) => {
    
    // if (!event.Details.Parameters || !event.Details.Parameters.phoneNumber) {
    //   console.log('event.Details.Parameters.phoneNumber doesnt exist.');
    //   return Responses._400({message: 'Missing telephone number'})
    // }

    const phoneNumber = event['Details']['Parameters']['phoneNumber'];
    const vanityNumbers = await createVanityNumbers(phoneNumber);
    const result: ConnectContactFlowResult = {};

    const finalVanityList = vanityNumbers.slice(-3); // taking the last three (or fewer) elements of the array to return to Connect

    for (let i = 0; i < finalVanityList.length; i++) {
        // result['number' + i] = finalVanityList[i].replace(/(.)/g, '$&, ');
        result['number' + i] = finalVanityList[i];
    }

    try {
      await Dynamo.put(TABLE_NAME as string, {
          Id: uuidv4(),
          phoneNumber,
          vanityNumbers
      });
  } catch (e) {
      console.log(e.message);
  }

  console.log(result);
  callback(null, result);
    
}