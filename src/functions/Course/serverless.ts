import type { AWS } from '@serverless/typescript';

import createCourse from './Create/index';
import deleteCourseById from './Delete/index';
import getCourseById from './Get/index';
import getAllCourses from './GetAll/index';
import updateCourseById from './Update/index';


const serverlessConfiguration: AWS = {
  service: 'Course-back',
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
        Resource: { 'Fn::GetAtt': ['CourseTable', 'Arn'] },
      },
      
    ],


  },
  // import the function via paths
  functions: { createCourse,getAllCourses,getCourseById,deleteCourseById,updateCourseById },
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
      CourseTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'CourseTable',
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          AttributeDefinitions: [
            {
              AttributeName: 'CourseID',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'CourseID',
              KeyType: 'HASH',
            },
          ],
        },
      },
    },


  },



};

module.exports = serverlessConfiguration;
