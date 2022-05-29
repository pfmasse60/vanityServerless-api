import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'vanityserverless-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'serverlessUser',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  
  package: { individually: true },
  custom: {
    tablename: 'vanityNumbers',
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  // import the function via paths
  functions: { 
    vanityNumber: {
      handler:  'src/functions/vanityNumber.handler',
      events: [
        {
          http: {
            method: 'put',
            path: 'vanity/{number}',
            cors: true
          }
        }
      ]
    }
  },

  resources: {
    Resources: {
      VanityTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: "${self:custom.tablename}",
          AttributeDefinitions: [
            { 
              AttributeName: "phoneNumber", AttributeType: "S"
            },
            {  
              AttributeName: "Id", AttributeType: "S"
            }
          ],
        KeySchema: [
          {
            AttributeName: "phoneNumber",
            KeyType: "HASH" 
          },
          {
            AttributeName: "Id",
            KeyType: "RANGE",
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      }
    }
  }
},
};

module.exports = serverlessConfiguration;
