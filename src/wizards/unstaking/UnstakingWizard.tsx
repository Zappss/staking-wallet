import React, { useCallback, useMemo } from 'react';
import { useNumber } from 'react-hanger';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { OrbsUntakingStepContent } from './OrbsUnstakingStepContent';
import { useUnstakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
import { WizardFinishStep } from '../finishStep/WizardFinishStep';
import { useTrackModal } from '../../services/analytics/analyticsHooks';
import { MODAL_IDS } from '../../services/analytics/analyticConstants';
import { Wizard } from '../../components/wizards/Wizard';

const STEPS_INDEXES = {
  unstakeOrbs: 0,
  finish: 1,
};

interface IProps {
  closeWizard(): void;
}

// TODO : O.L : FUTURE : The material-ui Modal requires passing a ref, decide what to do with this ref.
// Connect to store
export const UnstakingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    useTrackModal(MODAL_IDS.unstaking);
    const { closeWizard } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const unstakingWizardTranslations = useUnstakingWizardTranslations();
    const activeStep = useNumber(0);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Un-Stake orbs
        case STEPS_INDEXES.unstakeOrbs:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsUntakingStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={unstakingWizardTranslations('finishedAction_unstaked')}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={wizardsCommonTranslations('moveToStep_finish')}
              key={'guardianSelectionStep'}
              closeWizard={closeWizard}
            />
          );
        case STEPS_INDEXES.finish:
          return (
            <WizardFinishStep
              finishedActionDescription={unstakingWizardTranslations('afterSuccessStateExplanation')}
              onFinishClicked={closeWizard}
            />
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [activeStep.value, closeWizard, goToFinishStep, unstakingWizardTranslations, wizardsCommonTranslations]);

    const stepperTitles = useMemo(() => {
      return [unstakingWizardTranslations('stepLabel_unstake'), wizardsCommonTranslations('stepLabel_finish')];
    }, [unstakingWizardTranslations, wizardsCommonTranslations]);

    return (
      <Wizard
        activeStep={activeStep.value}
        stepperTitles={stepperTitles}
        content={stepContent}
        dataTestId={'wizard_unstaking'}
      />
    );
  }),
);
