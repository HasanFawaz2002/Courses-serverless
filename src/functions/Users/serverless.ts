import type { AWS } from '@serverless/typescript';

import createUserCourse from './Create/index';
import getAllUsers from './GetAll/index';
import getUserById from './Get/index';
import deleteUserById from './Delete/index'
import updateUserById from './Update/index'


const serverlessConfiguration: AWS = {
  service: 'User-back',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },


    iamRoleStatements: [
        
        {
          Effect: 'Allow',
          Action: [
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:Scan',
            'dynamodb:DeleteItem',
          ],
          Resource: { 'Fn::GetAtt': ['UsersCourseTable', 'Arn'] },
        },
      ],




  },
  // import the function via paths
  functions: {createUserCourse,getAllUsers,getUserById,deleteUserById,updateUserById},
  package: { individually: true },
  custom: {
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



  resources: {

    Resources: {
      

      UsersCourseTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'UsersCourseTable',  
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,  
            WriteCapacityUnits: 1, 
          },
          AttributeDefinitions: [
            {
              AttributeName: 'UserId', 
              AttributeType: 'S', 
            },
            
          ],
          KeySchema: [
            {
              AttributeName: 'UserId', 
              KeyType: 'HASH', 
            },
            
          ],
        },
      },

      
    },
  },



};

module.exports = serverlessConfiguration;
