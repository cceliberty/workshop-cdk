import { Arn, Duration, Environment, Stack } from 'aws-cdk-lib';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

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
    const t = this.getTopicArn(id, env, topicName);

    // Create new SQS
    const q = new Queue(this, `${id}-queue`, { queueName: `${id}-q` });

    // Add subscription on SNS ==> SQS
    t.addSubscription(new SqsSubscription(q));

    // Create new Lambda
    new NodejsFunction(this, `${id}-handler`, {
      runtime: Runtime.NODEJS_18_X,
      timeout: Duration.seconds(10),
      functionName: `${id}-handler`,
      entry: `${__dirname}/lambda/${topicName}.ts`,
      environment: {
        QUEUE_URL: q.queueUrl,
      },
    });

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
