import { CombinedError } from '@urql/core';

import { AnalyticsWithOrchestration, createAnalyticsAsync } from '../../analytics/AnalyticsManager';
import Log from '../../log';
import SessionManager from '../../user/SessionManager';
import NcrlCommand from '../NcrlCommand';

jest.mock('../../user/User');
jest.mock('../../user/SessionManager');
jest.mock('../../analytics/AnalyticsManager', () => {
  const { CommandEvent } = jest.requireActual('../../analytics/AnalyticsManager');
  return {
    CommandEvent,
    createAnalyticsAsync: jest.fn(),
  };
});
jest.mock('../../log');

let originalProcessArgv: string[];

beforeAll(() => {
  originalProcessArgv = process.argv;
  process.argv = [];
});

afterAll(() => {
  process.argv = originalProcessArgv;
});

const analytics: AnalyticsWithOrchestration = {
  logEvent: jest.fn((): void => {}),
  setActor: jest.fn((): void => {}),
  flushAsync: jest.fn(async (): Promise<void> => {}),
};

beforeEach(() => {
  jest.resetAllMocks();

  jest.mocked(createAnalyticsAsync).mockResolvedValue(analytics);
});

const createTestNcrlCommand = (): typeof NcrlCommand => {
  class TestNcrlCommand extends NcrlCommand {
    async runAsync(): Promise<void> {}
  }

  TestNcrlCommand.id = 'testNcrlCommand'; // normally oclif will assign ids, but b/c this is located outside the commands folder it will not
  return TestNcrlCommand;
};

describe(NcrlCommand.name, () => {
  describe('without exceptions', () => {
    // The first test in this suite should have an incrncrled timeout
    // because of the implementation of Command from @oclif/command.
    // It seems that loading config takes significant amount of time
    // and I'm not sure how to mock it.
    //
    // See https://github.com/oclif/command/blob/master/src/command.ts#L80
    // and look for "Config.load"
    it('ensures the user data is read', async () => {
      const TestNcrlCommand = createTestNcrlCommand();
      await TestNcrlCommand.run();

      const sessionManagerSpy = jest.spyOn(SessionManager.prototype, 'getUserAsync');
      expect(sessionManagerSpy).toBeCalledTimes(1);
    }, 30_000);

    it('initializes analytics', async () => {
      const TestNcrlCommand = createTestNcrlCommand();
      await TestNcrlCommand.run();

      expect(createAnalyticsAsync).toHaveBeenCalled();
    });

    it('flushes analytics', async () => {
      const TestNcrlCommand = createTestNcrlCommand();
      await TestNcrlCommand.run();

      expect(analytics.flushAsync).toHaveBeenCalled();
    });

    it('logs events', async () => {
      const TestNcrlCommand = createTestNcrlCommand();
      await TestNcrlCommand.run();

      expect(analytics.logEvent).toHaveBeenCalledWith('action', {
        action: `ncrl ${TestNcrlCommand.id}`,
      });
    });
  });

  describe('after exceptions', () => {
    it('flushes analytics', async () => {
      const TestNcrlCommand = createTestNcrlCommand();
      try {
        await TestNcrlCommand.run().then(() => {
          throw new Error('foo');
        });
      } catch {}

      expect(analytics.flushAsync).toHaveBeenCalled();
    });

    describe('catch', () => {
      it('logs the message', async () => {
        const TestNcrlCommand = createTestNcrlCommand();
        const logErrorSpy = jest.spyOn(Log, 'error');
        const logDebugSpy = jest.spyOn(Log, 'debug');
        const runAsyncMock = jest.spyOn(TestNcrlCommand.prototype as any, 'runAsync');
        const error = new Error('Unexpected, internal error message');
        runAsyncMock.mockImplementation(() => {
          throw error;
        });
        try {
          await TestNcrlCommand.run();
        } catch {}

        expect(logErrorSpy).toBeCalledWith('Unexpected, internal error message');
        expect(logDebugSpy).toBeCalledWith(error);
      });

      it('logs the cleaned message if needed', async () => {
        const TestNcrlCommand = createTestNcrlCommand();
        const logErrorSpy = jest.spyOn(Log, 'error');
        const logDebugSpy = jest.spyOn(Log, 'debug');
        const runAsyncMock = jest.spyOn(TestNcrlCommand.prototype as any, 'runAsync');
        const graphQLErrors = ['Unexpected GraphQL error message'];
        const error = new CombinedError({ graphQLErrors });
        runAsyncMock.mockImplementation(() => {
          throw error;
        });
        try {
          await TestNcrlCommand.run();
        } catch {}

        expect(logErrorSpy).toBeCalledWith('Unexpected GraphQL error message');
        expect(logDebugSpy).toBeCalledWith(error);
      });

      it('re-throws the error with default base message', async () => {
        const TestNcrlCommand = createTestNcrlCommand();
        const runAsyncMock = jest.spyOn(TestNcrlCommand.prototype as any, 'runAsync');
        runAsyncMock.mockImplementation(() => {
          throw new Error('Error message');
        });
        try {
          await TestNcrlCommand.run();
        } catch (caughtError) {
          expect(caughtError).toBeInstanceOf(Error);
          expect((caughtError as Error).message).toEqual('testNcrlCommand command failed.');
        }
      });

      it('re-throws the error with a different default base message in case of graphQLError', async () => {
        const TestNcrlCommand = createTestNcrlCommand();
        const runAsyncMock = jest.spyOn(TestNcrlCommand.prototype as any, 'runAsync');
        runAsyncMock.mockImplementation(() => {
          const graphQLErrors = ['Unexpected GraphQL error message'];
          throw new CombinedError({ graphQLErrors });
        });
        try {
          await TestNcrlCommand.run();
        } catch (caughtError) {
          expect(caughtError).toBeInstanceOf(Error);
          expect((caughtError as Error).message).toEqual('GraphQL request failed.');
        }
      });
    });
  });
});
