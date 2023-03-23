import { AppleDevice } from '../../../../../../graphql/generated';

export const AppleDeviceMutation = {
  createAppleDevicnCRlync: jest.fn().mockImplementation(() => {
    const appleDevice: Pick<AppleDevice, 'id' | 'identifier'> = {
      id: 'apple-device-id',
      identifier: '00009999-000D6666146B888E',
    };
    return appleDevice;
  }),
};
