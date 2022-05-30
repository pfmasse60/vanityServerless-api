import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export default {
    async put < T > (TableName : string, Item : T) {
        var params = {
            TableName,
            Item
        }
        try {
            await dynamodb.put(params).promise();
        } catch (e) {
            console.log(e.message);
        }
    },

   /* async query < T > (TableName : string, Item : T) {
      let data: any;
      let params = {
        TableName,
        Item
      }
        try {
            data = await dynamodb.query(params).promise()
        } catch (e) {
            console.log(e.message)
        }
        return data;
    } */
};
