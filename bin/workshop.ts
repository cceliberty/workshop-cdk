import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

const app = new App();

const config = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  baseName: 'cc',
  topicName: 'orders-updated',
};

interface SubscriberProps extends StackProps {
  topicName: string;
}

export class Subscriber extends Stack {
  constructor(scope: Construct, id: string, props: SubscriberProps) {
    super(scope, id, props);

    const { topicName } = props;

    new Topic(this, 'my-topic', { topicName });
  }
}

new Subscriber(app, `${config.baseName}-sub`, { topicName: `${config.baseName}-topic-name` });

/**
 * Publisher
 */
// new Publisher(app, 'pub', { topics: config.topicNames });
