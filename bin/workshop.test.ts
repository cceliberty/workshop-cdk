import { App } from 'aws-cdk-lib';
import { Subscriber } from './workshop';
import { Template } from 'aws-cdk-lib/assertions';

let template: Template;

beforeAll(() => {
  const app = new App();
  const stack = new Subscriber(app, 'test-stack', { topicName: 'my-topic-name' });

  template = Template.fromStack(stack);
});

describe('MyStack', () => {
  test('should contain resources', () => {
    template.resourceCountIs('AWS::SNS::Topic', 1);

    template.hasResourceProperties('AWS::SNS::Topic', {
      TopicName: 'my-topic-name',
    });
  });
});
