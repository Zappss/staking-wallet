import { action, computed, observable, reaction } from 'mobx';
import { ICryptoWalletConnectionService } from '../services/cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { IReactionDisposer } from 'mobx/lib/core/reaction';

export class CryptoWalletConnectionStore {
  @observable private walletConnectionRequestApproved: boolean;

  @observable public isMetamaskInstalled: boolean;

  @observable public mainAddress: string;

  reactionToWalletConnection: IReactionDisposer;

  constructor(private cryptoWalletConnectionService: ICryptoWalletConnectionService) {
    this.isMetamaskInstalled = cryptoWalletConnectionService.isMetamaskInstalled;

    this.reactionToWalletConnection = reaction(
      () => this.isConnectedToWallet,
      async (isConnected) => {
        if (isConnected) {
          this.readInformationFromConnectedWallet();
        }
      },
      {
        fireImmediately: true,
      },
    );

    if (this.isMetamaskInstalled) {
      this.cryptoWalletConnectionService.onMainAddressChange((address) => this.setMainAddress(address));
    }
  }

  @computed
  public get isConnectedToWallet(): boolean {
    return (
      this.isMetamaskInstalled &&
      (this.cryptoWalletConnectionService.didUserApproveWalletInThePast || this.walletConnectionRequestApproved)
    );
  }

  public async askToConnect(): Promise<boolean> {
    if (this.isConnectedToWallet) {
      return true;
    } else {
      const permissionGranted = await this.cryptoWalletConnectionService.requestConnectionPermission();
      this.setWalletConnectionRequestApproved(permissionGranted);

      return this.walletConnectionRequestApproved;
    }
  }

  private async readInformationFromConnectedWallet() {
    const walletAddress = await this.cryptoWalletConnectionService.getMainAddress();

    this.setMainAddress(walletAddress);
  }

  @action('setWalletConnectionRequestApproved')
  private setWalletConnectionRequestApproved(requestApproved: boolean) {
    this.walletConnectionRequestApproved = requestApproved;
  }

  @action('setMainAddress')
  private setMainAddress(mainAddress: string) {
    this.mainAddress = mainAddress;
  }
}
