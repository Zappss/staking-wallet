import React, { useCallback, useMemo } from 'react';
import { useNumber } from 'react-hanger';
import { ApprovableWizardStep } from '../approvableWizardStep/ApprovableWizardStep';
import { observer } from 'mobx-react';
import { OrbsRestakingStepContent } from './OrbsRestakingStepContent';
import { useRestakingWizardTranslations, useWizardsCommonTranslations } from '../../translations/translationsHooks';
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
export const RestakingWizard = observer(
  React.forwardRef<any, IProps>((props, ref) => {
    useTrackModal(MODAL_IDS.restaking);
    const { closeWizard } = props;

    const wizardsCommonTranslations = useWizardsCommonTranslations();
    const restakingWizardTranslations = useRestakingWizardTranslations();
    const activeStep = useNumber(0);
    const goToFinishStep = useCallback(() => activeStep.setValue(STEPS_INDEXES.finish), [activeStep]);

    const stepContent = useMemo(() => {
      switch (activeStep.value) {
        // Un-Stake orbs
        case STEPS_INDEXES.withdrawOrbs:
          return (
            <ApprovableWizardStep
              transactionCreationSubStepContent={OrbsRestakingStepContent}
              displayCongratulationsSubStep={false}
              finishedActionName={restakingWizardTranslations('finishedAction_restaked')}
              moveToNextStepAction={goToFinishStep}
              moveToNextStepTitle={wizardsCommonTranslations('moveToStep_finish')}
              key={'orbsRestakingStep'}
              closeWizard={closeWizard}
            />
          );
        case STEPS_INDEXES.finish:
          return (
            <WizardFinishStep
              finishedActionDescription={restakingWizardTranslations('afterSuccessStateExplanation')}
              onFinishClicked={closeWizard}
            />
          );
        default:
          throw new Error(`Unsupported step value of ${activeStep.value}`);
      }
    }, [activeStep.value, closeWizard, goToFinishStep, restakingWizardTranslations, wizardsCommonTranslations]);

    const stepperTitles = useMemo(() => {
      return [restakingWizardTranslations('stepLabel_restake'), wizardsCommonTranslations('stepLabel_finish')];
    }, [restakingWizardTranslations, wizardsCommonTranslations]);

    return (
      <Wizard
        activeStep={activeStep.value}
        stepperTitles={stepperTitles}
        content={stepContent}
        dataTestId={'wizard_restaking'}
      />
    );
  }),
);
