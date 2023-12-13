import { App } from 'aws-cdk-lib';
import { Subscriber } from '../lib/worker';

const app = new App();

const config = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  baseName: 'cc',
  topicName: 'orders-updated',
};

new Subscriber(app, `${config.baseName}-worker`, { env: config.env, topicName: config.topicName });

/**
 * Publisher
 */
// new Publisher(app, 'pub', { topics: config.topicNames });
