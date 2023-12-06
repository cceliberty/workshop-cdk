import 'aws-sdk-client-mock-jest';
import { mockClient } from 'aws-sdk-client-mock';
import { DeleteMessageBatchCommand, SQSClient } from '@aws-sdk/client-sqs';
import { handler } from './orders-updated';

import event from '../events/sample.json';

const sqsMock = mockClient(SQSClient);
const QUEUE_URL = 'queue-url';

beforeAll(() => {
  process.env.LOG_LEVEL = 'WARN';
});

beforeEach(() => {
  sqsMock.reset();
});

describe('[INTEGRATION] - handler', () => {
  sqsMock.onAnyCommand().resolves({});

  test('should call delete with correct parameters', async () => {
    process.env.QUEUE_URL = QUEUE_URL;

    await handler(event);

    expect(sqsMock).toHaveReceivedCommand(DeleteMessageBatchCommand);
    expect(sqsMock).toHaveReceivedCommandTimes(DeleteMessageBatchCommand, 1);
    expect(sqsMock).toReceiveCommandWith(DeleteMessageBatchCommand, {
      QueueUrl: QUEUE_URL,
      Entries: [
        {
          ReceiptHandle:
            'AQEBuTVd0CZhVrzveppI07ILuc2rS5i6aEJKggoZJ4dBmw/OPU7ZBxvEifT+uIeuNrodAYn2Z2YJ6So/zFBvS4v2psvUcY/oS1hWUG4QzymZSYLgoR4Qv25bdMrWzxJAJqCqijqvaQzKZIGjbsnZAejDDNKaDVVLyqj37Aa3Iu8AHogUbmdr4eCzJJ/++1JvkGZTKP3C3YXwEJ7nhU+ZPpBZaYKQEgXVtd8awmYhvGldekau1ESqBORKM7MLVfx3TJtfxGBufu6aH4oGULlBiJfE4HuN51bB3wg3qLkUlExCZ9SyajQQs6Mjl53ateJGvqRaxZkSPq5b1DCgnDgMdJ3uOk7YoHTansB8mksnq7Iri2OGX0jz8PkpR0Tml5/yrdUuSBhZwRfZDJn/W4ECG5gakohJxmP+lJRRVdDhK8ti9Ss=',
          Id: 'ab073e6e-0b97-4b44-8ca5-9beb2ac09199',
        },
      ],
    });
  });
});
