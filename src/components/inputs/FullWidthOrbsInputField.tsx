import React from 'react';
import { NumberFormatCustom } from './NumberFormatInput';
import { TextField, useTheme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

interface IProps {
  id: string;
  label: string;
  value: number;
  onChange: (newValue: number) => void;
}

export const FullWidthOrbsInputField = React.memo<IProps>(props => {
  const { id, label, value, onChange } = props;

  const theme = useTheme();

  const largerThanSmall = useMediaQuery(theme.breakpoints.up('sm'));
  const fontSize = largerThanSmall ? theme.typography.h2.fontSize : theme.typography.h3.fontSize;

  return (
    <TextField
      id={id}
      label={label}
      value={value}
      onChange={e => onChange(parseInt(e.target.value))}
      InputProps={{
        inputComponent: NumberFormatCustom as any,
        inputProps: {
          suffix: ' ORBS',
          fontSize: fontSize,
        },
      }}
      style={{
        width: '100%',
      }}
    />
  );
});
