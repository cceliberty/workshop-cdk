import { App } from 'aws-cdk-lib';
import { Subscriber } from '../lib/worker';
import { Publisher } from '../lib/publisher';

const config = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  baseName: 'cc',
  topicNames: ['orders-updated', 'contacts-updated', 'users-updated'],
};

/** Head of tree */
const app = new App();

/**
 * Subscriber
 */
const { env, baseName, topicNames } = config;
const stackName = `${baseName}-sub`;
new Subscriber(app, stackName, {
  description: 'Workers that subscribe to redpill table orders',
  topicNames,
  env,
  stackName,
});

/**
 * Publisher
 */
new Publisher(app, 'pub', { topics: config.topicNames });
