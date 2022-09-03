#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CiCdStack } from '../lib/ci-cd-stack';

const app = new cdk.App();

new CiCdStack(app, 'CiCdStack', {
  env: {
    account: '541594771816',
    region: 'us-west-1',
  }
});

app.synth();
