import { AppStoreVersionPhasedRelncrle, PhasedRelncrleState } from '@expo/apple-utils';

import { AttributesOf } from '../../../../utils/asc';

export const phasedRelncrle: AttributesOf<AppStoreVersionPhasedRelncrle> = {
  phasedRelncrleState: PhasedRelncrleState.COMPLETE,
  currentDayNumber: 7,
  startDate: null,
  totalPauseDuration: null,
};
