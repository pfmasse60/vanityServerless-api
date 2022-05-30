import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'vanityserverless-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-webpack'],

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
  
  provider: {
    name: 'aws',
    stage: 'dev',
    region: 'us-east-1',
    runtime: 'nodejs14.x',
    profile: 'serverlessUser',

    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      tableName: "${self:custom.tablename}",
    },

    iam: {
      role: {
        statements: [ 
          {
            Effect: 'Allow',
            Action: [ 
              'dynamodb:DescribeTable',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem'
            ],
            Resource: 'arn:aws:dynamodb::account-id:table/${self:custom.tablename}'
          }
        ]
      }
    }
  },

  package: { individually: true },

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
              AttributeName: "vanity1", AttributeType: "S"
            },
            { 
              AttributeName: "vanity2", AttributeType: "S"
            },
            { 
              AttributeName: "vanity3", AttributeType: "S"
            },
            { 
              AttributeName: "vanity4", AttributeType: "S"
            },
            { 
              AttributeName: "vanity5", AttributeType: "S"
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
