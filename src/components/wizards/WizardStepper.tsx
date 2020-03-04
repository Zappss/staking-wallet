import styled from 'styled-components';
import { Stepper } from '@material-ui/core';

export const WizardStepper = styled(Stepper)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0)',
  '.MuiStepIcon-root': {
    '.MuiStepIcon-text': {
      fill: theme.palette.primary.main, // Affects the numbers
    },
    color: theme.palette.secondary.main, // Affects the circles
  },
  padding: 0, // Removes the excessive padding
}));
