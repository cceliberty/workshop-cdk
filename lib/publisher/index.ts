import { Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

interface PublisherProps extends StackProps {
  topics: string[];
}

/**
 * Publisher creates an AWS resource with a SNS Topic
 *
 * This is only for project setup
 */
export class Publisher extends Stack {
  constructor(scope: Construct, id: string, props: PublisherProps) {
    super(scope, id, props);

    const { topics } = props;

    topics.forEach(topicName => {
      new Topic(this, `${id}-${topicName}-topic`, { topicName });
    });
  }
}
