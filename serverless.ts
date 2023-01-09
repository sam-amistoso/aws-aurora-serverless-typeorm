import type { AWS } from '@serverless/typescript';

import functions from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'ts-node-express',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    profile: 'samadmin',
    region: 'ap-northeast-1',
    runtime: 'nodejs14.x',
    stage: 'prod',
    timeout: 30,
    memorySize: 1024,
    endpointType: 'regional',
    lambdaHashingVersion: '20201221',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PASSKEY: '253D3FB468A0E24677C28A624BE0F939',
      AURORA_SECRET_ARN: '${self:custom.auroraSecretArn.all}',
      AURORA_RESOURCE_ARN: '${self:custom.auroraResourceArn.all}',
      MYSQL_DATABASE: '${self:custom.mySqlDatabase.all}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'rds-data:*',
            Resource: '${self:custom.auroraResourceArn.all}',
          },
          {
            Effect: 'Allow',
            Action: 'secretsmanager:GetSecretValue',
            Resource: {
              'Fn::Join': [
                '',
                [
                  'arn:aws:secretsmanager:${self:provider.region}:',
                  { Ref: 'AWS::AccountId' },
                  ':secret:*',
                ],
              ],
            },
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: functions,
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
    auroraSecretArn: {
      all: '${ssm:/ts-node-express/${sls:stage}/auroraSecretArn}',
    },
    auroraResourceArn: {
      all: '${ssm:/ts-node-express/${sls:stage}/auroraResourceArn}',
    },
    mySqlDatabase: {
      all: '${ssm:/ts-node-express/${sls:stage}/mySqlDatabase}',
    },
  },
};

module.exports = serverlessConfiguration;
