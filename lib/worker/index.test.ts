import { App } from 'aws-cdk-lib';
import { Subscriber } from './index';
import { Match, Template } from 'aws-cdk-lib/assertions';

let template: Template;
const stackId = 'test-stack';

beforeAll(() => {
  const app = new App();
  const stack = new Subscriber(app, stackId, {
    topicName: 'my-topic-name',
    env: { account: '012345678901', region: 'eu-west-1' },
  });

  template = Template.fromStack(stack);
});

describe('MyStack', () => {
  test('should contain resources', () => {
    template.resourceCountIs('AWS::SQS::Queue', 1);

    template.hasResourceProperties('AWS::SQS::Queue', {
      QueueName: Match.stringLikeRegexp(stackId),
    });
  });
});
