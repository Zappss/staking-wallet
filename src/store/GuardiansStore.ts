import { observable, action, reaction } from 'mobx';
import { OrbsPOSDataService } from 'orbs-pos-data';
import { IGuardianInfo } from 'orbs-pos-data/dist/orbs-pos-data-service';

export interface IGuardiansStoreState {
  guardiansAddresses: string[];
  guardiansList: IGuardianInfo[];
}

export const defaultPosStoreState: IGuardiansStoreState = {
  guardiansAddresses: [],
  guardiansList: [],
};

export type TGuardiansStore = IGuardiansStoreState;

export class GuardiansStore implements TGuardiansStore {
  @observable public guardiansAddresses: string[];
  @observable public guardiansList: IGuardianInfo[];

  constructor(private orbsPOSDataService: OrbsPOSDataService) {
    this.guardiansAddresses = [];
    this.guardiansList = [];

    const reactionOne = reaction(
      () => this.guardiansAddresses,
      async guardiansAddresses => {
        const promises = guardiansAddresses.map(guardianAddress =>
          this.orbsPOSDataService.getGuardianInfo(guardianAddress),
        );
        this.setGuardiansList(await Promise.all(promises));
      },
    );
  }

  async init() {
    const guardiansAddresses = await this.orbsPOSDataService.getGuardiansList(0, 100);

    this.setGuardiansAddresses(guardiansAddresses);
  }

  @action('setGuardiansAddresses')
  private setGuardiansAddresses(addresses: string[]) {
    this.guardiansAddresses = addresses;
  }

  @action('setGuardiansList')
  private setGuardiansList(guardians: IGuardianInfo[]) {
    this.guardiansList = guardians;
  }
}
