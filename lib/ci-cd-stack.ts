import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep, Step } from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { MyPipelineAppStage } from './stage';

export class CiCdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'TestPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('dukeweezo/aws-ci-cd-test', 'master'),
        commands: ['npm ci',  
                   'npx cdk synth']
      })
    });
    
    const testingStage = pipeline.addStage(new MyPipelineAppStage(this, "test", {
      env: { account: "541594771816", region: "us-west-1" }
    }));

    testingStage.addPre(new ShellStep("Run Unit Tests", { commands: ['pip install -r requirements.txt'] }));
    testingStage.addPost(new ManualApprovalStep('Manual approval before production'));

    const prodStage = pipeline.addStage(new MyPipelineAppStage(this, "prod", {
      env: { account: "541594771816", region: "us-west-1" }
    }));
    
  }
}