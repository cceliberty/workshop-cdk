import { App } from 'aws-cdk-lib';
import { Capture, Match, Template } from 'aws-cdk-lib/assertions';

import { Subscriber } from '.';

let template: Template;
const TOPIC_NAME_A = 'orders-updated';
// 👇
const TOPIC_NAME_B = 'contacts-updated';
const TOPIC_NAME_C = 'users-updated';
const topicNames = [TOPIC_NAME_A, TOPIC_NAME_B, TOPIC_NAME_C];

const STACK_ID = 'stack-id';

beforeAll(() => {
  const app = new App();
  const stack = new Subscriber(app, STACK_ID, {
    env: { account: '012345678910', region: 'eu-west-1' },
    topicNames,
  });
  template = Template.fromStack(stack);
});

describe('MyStack', () => {
  test('should contain SQS', () => {
    template.resourceCountIs('AWS::SQS::Queue', 3);

    template.hasResourceProperties('AWS::SQS::Queue', {
      QueueName: Match.stringLikeRegexp(STACK_ID),
    });
  });

  test('should subscribe SQS to SNS', () => {
    template.resourceCountIs('AWS::SNS::Subscription', 3);
    template.resourceCountIs('AWS::SQS::QueuePolicy', 3);

    const capturePolicy = new Capture();
    template.hasResourceProperties('AWS::SQS::QueuePolicy', {
      PolicyDocument: { Statement: [{ Condition: { ArnEquals: { 'aws:SourceArn': capturePolicy } } }] },
    });
    template.hasResourceProperties('AWS::SNS::Subscription', {
      Protocol: 'sqs',
      TopicArn: capturePolicy,
    });
  });

  test('should create lambda', () => {
    template.resourceCountIs('AWS::Lambda::Function', 3);

    topicNames.forEach(topicName => {

      template.hasResourceProperties('AWS::Lambda::Function', {
        FunctionName: Match.stringLikeRegexp(topicName),
      });
    })
  });

  test('should attach SQS event source to Lambda', () => {
    template.resourceCountIs('AWS::Lambda::EventSourceMapping', 3);
    template.resourceCountIs('AWS::SQS::QueuePolicy', 3);

    const captureQueuePolicy = new Capture();

    template.hasResourceProperties('AWS::SQS::QueuePolicy', {
      Queues: [{ Ref: captureQueuePolicy }],
    });

    template.hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      EventSourceArn: { 'Fn::GetAtt': Match.arrayWith([captureQueuePolicy]) },
    });
  });

  test('should pass queue url to lambda on env var', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Environment: {
        Variables: { QUEUE_URL: Match.anyValue() },
      },
    });
  });
});
