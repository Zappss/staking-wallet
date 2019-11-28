import Grid from '@material-ui/core/Grid';
import { observer } from 'mobx-react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Guardians } from './components/Guardians';
import { Header } from './components/nav/Header';
import { Sidebar } from './components/nav/Sidebar';
import { MyWalletPage } from './pages/MyWalletPage';
import { WalletPageWrapper } from './pages/WalletPageWrapper';
import { useCryptoWalletIntegrationStore } from './store/storeHooks';
import styled from 'styled-components';

const ContentContainer = styled.div`
  display: flex;
`;

export const App = observer(() => {
  const CryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();

  return (
    <>
      <Header />
      <ContentContainer>
        <nav>
          <Sidebar isConnectedToWallet={CryptoWalletIntegrationStore.isConnectedToWallet} />
        </nav>
        <main>
          <Switch>
            <Route exact path='/' component={WalletPageWrapper} />
            <Route path='/stake' component={MyWalletPage} />
            <Route path='/guardians' component={Guardians} />
          </Switch>
        </main>
      </ContentContainer>
    </>
  );
});
