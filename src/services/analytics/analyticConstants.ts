export const MODAL_IDS = {
  staking: 'Staking',
  unstaking: 'Unstaking',
  restaking: 'Restaking',
  withdrawing: 'Withdrawing',
  guardianChange: 'GuardianChange',
};

export const STAKING_ACTIONS = {
  staking: 'Staking',
  unstaking: 'Unstaking',
  restaking: 'Restaking',
  withdrawing: 'Withdrawing',
  guardianChange: 'GuardianChange',
};

export const EVENT_CATEGORIES = {
  tokenStake: 'Token Stake',
};

type ValueOf<T> = T[keyof T];
export type TModalId = ValueOf<typeof MODAL_IDS>;
export type TStackingAction = ValueOf<typeof STAKING_ACTIONS>;
export type TEventCategories = ValueOf<typeof EVENT_CATEGORIES>;
