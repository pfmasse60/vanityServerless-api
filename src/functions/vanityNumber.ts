import {APIGatewayProxyHandler} from 'aws-lambda';
import Responses from '../common/API_Responses';

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const vanityNumber = event.pathParameters?.number as string;

    return Responses._200(vanityNumber);
};
