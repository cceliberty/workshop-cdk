import { StackProps, Environment, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Worker } from './worker';

interface SubscriberProps extends StackProps {
  env: Environment;
  topicNames: string[];
}

/**
 * Subscriber creates an AWS resource with a SNS Topic
 *
 * Prototype-based Class (javascript) vs Class-based Inheritance (java)
 */
export class Subscriber extends Stack {
  constructor(scope: Construct, id: string, props: SubscriberProps) {
    super(scope, id, props);

    const { env, topicNames } = props;

    topicNames.forEach(topicName => {
      new Worker(this, `${id}-${topicName}-wrkr`, {
        env,
        topicName,
      });
    });
  }
}
