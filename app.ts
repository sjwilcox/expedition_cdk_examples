import * as cdk from 'aws-cdk-lib';
import { AppStack } from './app-stack'; // Import the stack
import { ACCOUNT_ID, AWS_REGION } from './constants'; // Import from constants.ts

const app = new cdk.App();
new AppStack(app, 'AppStack', {
  env: { account: ACCOUNT_ID, region: AWS_REGION },
});

app.synth();
