import React, { useCallback, useMemo } from 'react';
import {
  Grid,
  Button,
  Input,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { useNumber } from 'react-hanger';
import styled from 'styled-components';
import { useOrbsAccountStore } from '../../store/storeHooks';

const WizardContainer = styled(props => <Grid container direction={'column'} alignItems={'center'} {...props} />)({});

const WizardContent = styled(props => (
  <Grid container direction={'column'} alignItems={'center'} item xs={11} sm={11} md={10} lg={9} xl={8} {...props} />
))({});

const StyledStepper = styled(Stepper)(styledProps => ({
  backgroundColor: 'rgba(0, 0, 0, 0)',
}));

interface IProps {
  closeWizard(): void;
}

export const StakingWizard: React.FC<IProps> = props => {
  const { closeWizard } = props;
  const orbsAccountStore = useOrbsAccountStore();
  const orbsForStaking = useNumber(parseInt(orbsAccountStore.liquidOrbs)); // Start with the maximum amount

  const activeStep = useNumber(0);
  const goToNextStep = useCallback(() => activeStep.increase(), [activeStep]);

  const stakeTokens = useCallback(async () => {
    try {
      const { txVerificationListener } = await orbsAccountStore.stakeOrbs(orbsForStaking.value);

      activeStep.increase();
    } catch (e) {
      console.error(e);
    }
  }, [orbsAccountStore, activeStep, orbsForStaking]);

  const stepContent = useMemo(() => {
    switch (activeStep.value) {
      // Stake orbs
      case 0:
        return (
          <WizardContent data-testid={'wizard_step_select_amount_for_stake'}>
            <Typography>Staking your tokens in the smart contract</Typography>
            {/* TODO : O.L : Add a number formatter here to dispaly the sums with proper separation */}
            <Input
              type={'number'}
              value={orbsForStaking.value}
              onChange={e => orbsForStaking.setValue(parseInt(e.target.value))}
              inputProps={{ 'data-testid': 'orbs_amount_for_staking' }}
            />
            <Button onClick={stakeTokens}>STAKE</Button>
          </WizardContent>
        );
      // Wait for staking tx approval
      case 1:
        return (
          <WizardContent data-testid={'wizard_step_wait_for_staking_confirmation'}>
            <Typography>Approving your transaction</Typography>
            <div data-testid={'transaction_pending_indicator'}></div>
            <Typography>
              Link to{' '}
              <a href={'https://etherscan.com'} target={'_blank'} rel={'noopener noreferrer'}>
                Ether Scan
              </a>{' '}
            </Typography>
            <Typography variant={'caption'}>Wait a few seconds... </Typography>
            <Button onClick={goToNextStep}>Proceed</Button>
          </WizardContent>
        );
      // Display success
      case 2:
        return (
          <WizardContent>
            <Typography>Congratulations</Typography>
            <Typography>You have successfully staked Yamba orbs </Typography>
            <Button onClick={goToNextStep}>Select a Guardian</Button>
          </WizardContent>
        );
      // Select a guardian
      case 3:
        return (
          <WizardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rank</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Selection</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* Demo row 1 */}
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>Douglas Meshuga</TableCell>
                    <TableCell>0xff45223cb</TableCell>
                    <TableCell>
                      <Button onClick={goToNextStep}>Select</Button>
                    </TableCell>
                  </TableRow>

                  {/* Demo row 2 */}
                  <TableRow>
                    <TableCell>2</TableCell>
                    <TableCell>Marina Aliasi</TableCell>
                    <TableCell>0x0343feab</TableCell>
                    <TableCell>
                      <Button onClick={goToNextStep}>Select</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </WizardContent>
        );
      // Wait for guardian selection tx approval
      case 4:
        return (
          <WizardContent>
            <Typography>Approving your transaction</Typography>
            <Typography>
              Link to{' '}
              <a href={'https://etherscan.com'} target={'_blank'} rel={'noopener noreferrer'}>
                Ether Scan
              </a>{' '}
            </Typography>
            <Typography variant={'caption'}>Wait a few seconds... </Typography>
            <Button onClick={goToNextStep}>Proceed</Button>
          </WizardContent>
        );
      case 5:
        return (
          <WizardContent>
            <Typography>Congratulations</Typography>
            <Typography>You have successfully selected a guardian </Typography>
            <Button onClick={() => null}>Finish</Button>
          </WizardContent>
        );
      default:
        throw new Error(`Unsupported step value of ${activeStep.value}`);
    }
  }, [activeStep.value, goToNextStep, orbsForStaking, stakeTokens]);

  return (
    <WizardContainer data-testid={'wizard_staking'}>
      <StyledStepper activeStep={activeStep.value} alternativeLabel>
        <Step>
          <StepLabel>Staking your tokens</StepLabel>
        </Step>

        <Step>
          <StepLabel>Approving your transaction</StepLabel>
        </Step>

        <Step>
          <StepLabel>Success staking orbs</StepLabel>
        </Step>

        <Step>
          <StepLabel>Select a guardian</StepLabel>
        </Step>

        <Step>
          <StepLabel>Approving your transaction</StepLabel>
        </Step>

        <Step>
          <StepLabel>Success selecting guardian</StepLabel>
        </Step>
      </StyledStepper>

      {stepContent}
    </WizardContainer>
  );
};
