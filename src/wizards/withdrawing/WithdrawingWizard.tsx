import React, { useCallback, useMemo } from 'react';
import { useNumber } from 'react-hanger';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { OrbsWithdrawingStepContent } from './OrbsWithdrawingStepContent';
import { useWithdrawingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { WizardFinishStep } from '../finishStep/WizardFinishStep';
import { useTrackModal } from '../../services/analytics/analyticsHooks';
import { MODAL_IDS } from '../../services/analytics/analyticConstants';
import { Wizard } from '../../components/wizards/Wizard';

const STEPS_INDEXES = {
  withdrawOrbs: 0,
  finish: 1,
};

interface IProps {
  closeWizard(): void;
}

// TODO : O.L : FUTURE : The material-ui Modal requires passing a ref, decide what to do with this ref.
// Connect to store
export const WithdrawingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    useTrackModal(MODAL_IDS.withdrawing);
    const { closeWizard } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const withdrawingWizardTranslations = useWithdrawingWizardTranslations();
    const activeStep = useNumber(0);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Un-Stake orbs
        case STEPS_INDEXES.withdrawOrbs:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsWithdrawingStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={withdrawingWizardTranslations('finishedAction_withdrew')}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={wizardsCommonTranslations('moveToStep_finish')}
              key={'guardianSelectionStep'}
              closeWizard={closeWizard}
            />
          );
        case STEPS_INDEXES.finish:
          return (
            <WizardFinishStep
              finishedActionDescription={withdrawingWizardTranslations('afterSuccessStateExplanation')}
              onFinishClicked={closeWizard}
            />
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [activeStep.value, closeWizard, goToFinishStep, withdrawingWizardTranslations, wizardsCommonTranslations]);

    const stepperTitles = useMemo(() => {
      return [withdrawingWizardTranslations('stepLabel_withdraw'), wizardsCommonTranslations('stepLabel_finish')];
    }, [withdrawingWizardTranslations, wizardsCommonTranslations]);

    return (
      <Wizard
        activeStep={activeStep.value}
        stepperTitles={stepperTitles}
        content={stepContent}
        dataTestId={'wizard_withdrawing'}
      />
    );
  }),
);
