import React, { useCallback, useMemo } from 'react';
import { observer } from 'mobx-react';
import { useCryptoWalletIntegrationStore } from '../store/storeHooks';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import copy from 'copy-to-clipboard';
import { Button } from '@material-ui/core';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import { CustomSnackBarContent } from '../components/snackbar/CustomSnackBarContent';
import { useBoolean } from 'react-hanger';

const LoweCaseButton = styled(Button)({
  textTransform: 'none',
});

export const MyWalletPage = observer(() => {
  const history = useHistory();
  const cryptoWalletIntegrationStore = useCryptoWalletIntegrationStore();
  const showSnackbarMessage = useBoolean(false);

  const navigateToStakeOrbs = useCallback(() => history.push('/stake'), [history]);
  const copyAddress = useCallback(() => {
    copy(cryptoWalletIntegrationStore.mainAddress);
    showSnackbarMessage.setTrue();
  }, [cryptoWalletIntegrationStore.mainAddress, showSnackbarMessage]);

  return (
    <Container data-testid={'page-my-wallet'}>
      <Grid item xs={12}>
        <Typography variant={'h4'}>Wallet Info</Typography>
        {/* Details section */}
        <div>
          {/* Address */}
          <span data-testid={'text-active-address'}> Address : {cryptoWalletIntegrationStore.mainAddress} </span>
          <LoweCaseButton onClick={copyAddress}> Copy </LoweCaseButton>
          <LoweCaseButton> QR </LoweCaseButton>
          <br />

          <span data-testid={'text-user-email'}> Your Email : </span>
        </div>
        <br />
        {/* balance */}
        <div>
          <Typography>Balance</Typography>
          Liquid Orbs : <span data-testid={'text-liquid-orbs'}>{cryptoWalletIntegrationStore.liquidOrbs}</span>
          <br />
          Staked Orbs : <span data-testid={'text-staked-orbs'}>{cryptoWalletIntegrationStore.stakedOrbs}</span>
          <br />
          <LoweCaseButton onClick={navigateToStakeOrbs}>Stake Your Tokens</LoweCaseButton>
        </div>
        <br />
        {/* Rewards */}
        Total Rewards :{' '}
        <span data-testid={'text-total-rewards'}>{cryptoWalletIntegrationStore.accumulatedRewards}</span>
        <LoweCaseButton>History</LoweCaseButton>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={showSnackbarMessage.value}
        autoHideDuration={2000}
        onClose={showSnackbarMessage.setFalse}
      >
        <CustomSnackBarContent
          variant={'success'}
          message={'Copied Address !'}
          onClose={showSnackbarMessage.setFalse}

          data-testid={'message-address-was-copied'}
        />
      </Snackbar>
    </Container>
  );
});
