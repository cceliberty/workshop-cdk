import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

const app = new App();

interface MyStackProps extends StackProps {
  topicName: string;
}

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: MyStackProps) {
    super(scope, id, props);

    const { topicName } = props;

    new Topic(this, 'my-topic', { topicName });
  }
}

new MyStack(app, 'my-stack', { topicName: 'my-topic' });

app.synth();
