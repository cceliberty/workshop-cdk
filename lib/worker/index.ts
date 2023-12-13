import { Arn, Environment, Stack } from 'aws-cdk-lib';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { Queue } from 'aws-cdk-lib/aws-sqs';

interface SubscriberProps {
  env: Environment;
  topicName: string;
}

/**
 * Subscriber creates an AWS resource with a SNS Topic
 *
 * Prototype-based Class (javascript) vs Class-based Inheritance (java)
 */
export class Subscriber extends Stack {
  constructor(scope: Construct, id: string, props: SubscriberProps) {
    super(scope, id, props);

    const { env, topicName } = props;

    // Retrieve existing SNS
    this.getTopicArn(id, env, topicName);

    // Create new SQS
    new Queue(this, `${id}-queue`, { queueName: `${id}-q` });

    // Add subscription on SNS ==> SQS

    // Create new Lambda

    // Add event source on Lambda <== SQS
  }

  /**
   * getTopicArn is a method to retrieve an existing topic
   *
   * @param id The id of the retrieved topic (passed from Stack id)
   * @param env Environment (account that is being deployed)
   * @param topicName Name of topic to retrieve
   * @returns A Topic Interface
   */
  getTopicArn(id: string, env: Environment, topicName: string): ITopic {
    const topicArn = Arn.format({
      partition: 'aws',
      resource: topicName,
      service: 'sns',
      account: env.account,
      region: env.region,
    });
    return Topic.fromTopicArn(this, `${id}-topic`, topicArn);
  }
}
