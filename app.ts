import * as cdk from 'aws-cdk-lib';
import { AppStack } from './example_stack'; 
import { ACCOUNT_ID, AWS_REGION } from './constants'; 

const app = new cdk.App();
new AppStack(app, 'AppStack', {
  env: { account: ACCOUNT_ID, region: AWS_REGION },
});

app.synth();
