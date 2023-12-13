import { Arn, Duration, Environment } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

interface WorkerProps {
  env: Environment;
  topicName: string;
}

/**
 * Worker creates an AWS resource with a SNS Topic
 *
 * Prototype-based Class (javascript) vs Class-based Inheritance (java)
 */
export class Worker extends Construct {
  constructor(scope: Construct, id: string, props: WorkerProps) {
    super(scope, id);

    const { env, topicName } = props;

    // Retrieve SNS
    const topic = this.getTopicArn(id, env, topicName);

    // SQS
    const queue = new Queue(this, `${id}-queue`, { queueName: `${id}-queue` });
    // SNS => SQS
    topic.addSubscription(new SqsSubscription(queue));

    // Lambda
    const handler = new NodejsFunction(this, `${id}-handler`, {
      runtime: Runtime.NODEJS_18_X,
      timeout: Duration.seconds(10),
      functionName: `${id}-handler`,
      entry: `${__dirname}/lambda/${topicName}.ts`,
      environment: {
        QUEUE_URL: queue.queueUrl,
      },
    });

    // SQS => Lambda
    handler.addEventSource(
      new SqsEventSource(queue, {
        reportBatchItemFailures: true,
      }),
    );
  }

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
