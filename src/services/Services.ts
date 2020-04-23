import {
  GuardiansService,
  IGuardiansService,
  IOrbsPOSDataService,
  IOrbsTokenService,
  IStakingService,
  OrbsClientService,
  orbsPOSDataServiceFactory,
  OrbsTokenService,
  StakingService,
  IOrbsClientService,
} from 'orbs-pos-data';
import Web3 from 'web3';
import { AxiosInstance } from 'axios';
import config from '../config';
import { CryptoWalletConnectionService } from './cryptoWalletConnectionService/CryptoWalletConnectionService';
import { ICryptoWalletConnectionService } from './cryptoWalletConnectionService/ICryptoWalletConnectionService';
import { IEthereumProvider } from './cryptoWalletConnectionService/IEthereumProvider';
import { BuildOrbsClient } from './OrbsClientFactory';
import { AnalyticsService } from './analytics/analyticsService';
import { IAnalyticsService } from './analytics/IAnalyticsService';
import { HttpService } from './http/HttpService';
import { IHttpService } from './http/IHttpService';
import { IOrbsEndpointService } from './orbsEndpoint/IOrbsEndpointService';
import { OrbsEndpointService } from './orbsEndpoint/OrbsEndpointService';

export interface IServices {
  httpService: IHttpService;
  orbsPOSDataService: IOrbsPOSDataService;
  cryptoWalletConnectionService: ICryptoWalletConnectionService;
  stakingService: IStakingService;
  orbsTokenService: IOrbsTokenService;
  guardiansService: IGuardiansService;
  orbsEndpointService: IOrbsEndpointService;
  analyticsService: IAnalyticsService;
}

export function buildServices(ethereumProvider: IEthereumProvider, axios: AxiosInstance): IServices {
  let web3: Web3;

  if (ethereumProvider) {
    web3 = new Web3(ethereumProvider as any);
  } else {
    web3 = new Web3(new Web3.providers.WebsocketProvider(config.ETHEREUM_PROVIDER_WS));
  }
  const orbsClient = BuildOrbsClient();
  const orbsClientService: IOrbsClientService = new OrbsClientService(orbsClient);
  const httpService: IHttpService = new HttpService(axios);

  return {
    httpService,
    cryptoWalletConnectionService: new CryptoWalletConnectionService(ethereumProvider),
    orbsPOSDataService: orbsPOSDataServiceFactory(web3, orbsClient as any, config?.contractsAddressesOverride),
    stakingService: new StakingService(web3, config?.contractsAddressesOverride?.stakingContract),
    orbsTokenService: new OrbsTokenService(web3, config?.contractsAddressesOverride?.erc20Contract),
    guardiansService: new GuardiansService(
      web3,
      orbsClientService,
      config?.contractsAddressesOverride,
      config?.earliestBlockForDelegationOverride
        ? {
            earliestBlockForDelegation: config.earliestBlockForDelegationOverride,
          }
        : undefined,
    ),
    orbsEndpointService: new OrbsEndpointService(httpService, config.orbsEndpointUrl),
    analyticsService: new AnalyticsService(config.gaTrackerId, config.analyticsActive),
  };
}
