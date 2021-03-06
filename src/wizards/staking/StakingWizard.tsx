import React, { useCallback, useMemo } from 'react';
import { useNumber } from 'react-hanger';
import { OrbsStakingStepContent } from './OrbsStakingStepContent';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { OrbsAllowanceStepContent } from './OrbsAllowanceStepContent';
import { observer } from 'mobx-react';
import { GuardianSelectionStepContent, IGuardianSelectionStepContentProps } from './GuardianSelectionStepContent';
import { useOrbsAccountStore } from '../../store/storeHooks';
import { useStakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { WizardFinishStep } from '../finishStep/WizardFinishStep';
import { useTrackModal } from '../../services/analytics/analyticsHooks';
import { MODAL_IDS } from '../../services/analytics/analyticConstants';
import { Wizard } from '../../components/wizards/Wizard';

const STEPS_INDEXES = {
  allowTransfer: 0,
  stakeOrbs: 1,
  selectGuardian: 2,
  finish: 3,
};

interface IProps {
  closeWizard(): void;
}

// TODO : O.L : FUTURE : The material-ui Modal requires passing a ref, decide what to do with this ref.
// Connect to store
export const StakingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    const { closeWizard } = props;

    useTrackModal(MODAL_IDS.staking);

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const stakingWizardTranslations = useStakingWizardTranslations();
    const orbsAccountStore = useOrbsAccountStore();
    // DEV_NOTE : O.L : if a user has an unused allowance it probably means that his process was cut in the middle.
    const initialStep = orbsAccountStore.hasUnusedAllowance ? STEPS_INDEXES.stakeOrbs : STEPS_INDEXES.allowTransfer;
    const activeStep = useNumber(initialStep);
    const goToStakeOrbsStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.stakeOrbs), [activeStep]);
    const goToSelectGuardianStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.selectGuardian), [activeStep]);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    // DEV_NOTE : adds the selected guardian address to allow user to press 'keep'
    const extraPropsForGuardianSelection = useMemo<IGuardianSelectionStepContentProps>(() => {
      return {
        selectedGuardianAddress: orbsAccountStore.selectedGuardianAddress,
      };
    }, [orbsAccountStore.selectedGuardianAddress]);

    // DEV_NOTE : In certain cases, such as when the user already has a selected guardian or the user is a Guardian himself,
    //            we would like to skip on the 'guardian selection' sub-step.
    const { nextStepAfterStakingTitle, goToNextStepAfterStaking } = useMemo<{
      goToNextStepAfterStaking: () => void;
      nextStepAfterStakingTitle: string;
    }>(() => {
      let goToNextStepAfterStaking: () => void;
      let nextStepAfterStakingTitle: string;
      const shouldSkipGuardianSelection = orbsAccountStore.isGuardian || orbsAccountStore.hasSelectedGuardian;

      if (shouldSkipGuardianSelection) {
        goToNextStepAfterStaking = goToFinishStep;
        nextStepAfterStakingTitle = wizardsCommonTranslations('moveToStep_finish');
      } else {
        goToNextStepAfterStaking = goToSelectGuardianStep;
        nextStepAfterStakingTitle = stakingWizardTranslations('moveToStep_selectGuardian');
      }

      return {
        goToNextStepAfterStaking,
        nextStepAfterStakingTitle,
      };
    }, [
      goToFinishStep,
      goToSelectGuardianStep,
      orbsAccountStore.hasSelectedGuardian,
      orbsAccountStore.isGuardian,
      stakingWizardTranslations,
      wizardsCommonTranslations,
    ]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Stake orbs
        case STEPS_INDEXES.allowTransfer:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsAllowanceStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={stakingWizardTranslations('finishedAction_approved')}
              moveToNextStepAction={goToStakeOrbsStep}
              moveToNextStepTitle={stakingWizardTranslations('moveToStep_stake')}
              closeWizard={closeWizard}
              key={'approvingStep'}
            />
          );
        // Stake orbs
        case STEPS_INDEXES.stakeOrbs:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsStakingStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={stakingWizardTranslations('finishedAction_staked')}
              moveToNextStepAction={goToNextStepAfterStaking}
              moveToNextStepTitle={nextStepAfterStakingTitle}
              closeWizard={closeWizard}
              key={'stakingStep'}
            />
          );
        // Select a guardian
        case STEPS_INDEXES.selectGuardian:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={GuardianSelectionStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={stakingWizardTranslations('stepLabel_selectGuardian')}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={wizardsCommonTranslations('moveToStep_finish')}
              key={'guardianSelectionStep'}
              closeWizard={closeWizard}
              propsForTransactionCreationSubStepContent={extraPropsForGuardianSelection}
            />
          );
        case STEPS_INDEXES.finish:
          return (
            <WizardFinishStep
              finishedActionDescription={stakingWizardTranslations('afterSuccessStateExplanation')}
              onFinishClicked={closeWizard}
            />
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [
      activeStep.value,
      closeWizard,
      extraPropsForGuardianSelection,
      goToFinishStep,
      goToNextStepAfterStaking,
      goToStakeOrbsStep,
      nextStepAfterStakingTitle,
      stakingWizardTranslations,
      wizardsCommonTranslations,
    ]);

    const stepperTitles = useMemo(() => {
      return [
        stakingWizardTranslations('stepLabel_approve'),
        stakingWizardTranslations('stepLabel_stake'),
        stakingWizardTranslations('stepLabel_selectGuardian'),
        wizardsCommonTranslations('stepLabel_finish'),
      ];
    }, [stakingWizardTranslations, wizardsCommonTranslations]);

    return (
      <Wizard
        activeStep={activeStep.value}
        stepperTitles={stepperTitles}
        content={stepContent}
        dataTestId={'wizard_staking'}
      />
    );
  }),
);
