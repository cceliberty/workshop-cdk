import {
  SQSClient,
  DeleteMessageBatchRequestEntry,
  DeleteMessageBatchCommandOutput,
  DeleteMessageBatchCommand,
} from '@aws-sdk/client-sqs';
import { SQSEvent } from 'aws-lambda';
import pino from 'pino';

let sqsClient = new SQSClient({ region: process.env.REGION });
const logger = pino({ name: 'worker-orders', level: process.env.LOG_LEVEL || 'info' });

/**
 * handler is the Lambda entry point
 *
 * @param event incoming event
 * @returns void
 */
export const handler = async (event: SQSEvent) => {
  const queueUrl = process.env.QUEUE_URL;

  if (!queueUrl) {
    return Promise.reject('missing env vars');
  }
  if (!sqsClient) {
    sqsClient = new SQSClient({ region: process.env.REGION });
  }

  // Process incoming events
  const processResults = run(event);

  // Delete successfull events
  const response = await batchDelete(sqsClient, queueUrl, processResults);

  logger.info(response, 'response from event');
};

/**
 * run is a wrapper that has all dependencies to execute the function
 *
 * @param event incoming event
 * @returns Result from deleting messages from SQS
 */
export const run = (event: SQSEvent): DeleteMessageBatchRequestEntry[] => {
  const msgsToDelete: DeleteMessageBatchRequestEntry[] = [];

  event.Records.forEach(record => {
    const body = JSON.parse(record.body);
    logger.info(body, 'incoming body');

    if ('Message' in body) {
      const success = processRecord(body.Message);
      success && msgsToDelete.push({ ReceiptHandle: record.receiptHandle, Id: record.messageId });
    } else {
      logger.warn(body, 'skipping delete message');
    }
  });

  logger.info(msgsToDelete, 'msgs to delete');

  return msgsToDelete;
};

/**
 * processRecord is  where the paylod is processed
 *
 * @param body The payload
 * @returns Success message
 */
const processRecord = (body: unknown): boolean => {
  // 🕴️ Here's where magic happens
  logger.info(body, 'body processed');
  return true;
};

/**
 * batchDelete is a wrapper for `DeleteMessageBatchCommand`
 *
 * By default it is required to call delete after processing messages
 * @see {@link https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/command/DeleteMessageBatchCommand/}
 *
 * @param client {SQSClient} SQSClient
 * @param queueUrl Queue url (provided when creating the queue)
 * @param processResults Identification information about the messages to delete
 * @returns Result from SDK call `Promise<DeleteMessageBatchCommandOutput>`
 */
const batchDelete = async (
  client: SQSClient,
  queueUrl: string,
  processResults: DeleteMessageBatchRequestEntry[],
): Promise<DeleteMessageBatchCommandOutput> => {
  const input = {
    QueueUrl: queueUrl,
    Entries: processResults,
  };

  logger.info(input, 'input for batch delete');
  const command = new DeleteMessageBatchCommand(input);
  return await client.send(command);
};
