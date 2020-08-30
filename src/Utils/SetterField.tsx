import React, { FocusEvent, KeyboardEvent, ChangeEvent } from 'react';

import {
  Checkbox,
  TextField,
  TextFieldProps,
  MenuItem,
  FormControlLabelProps,
  FormControlLabel,
} from '@material-ui/core';

export type ChoiceType = { label: string; value: string };
interface FieldDefinition<ValueT, StateT> {
  field: keyof StateT;
  modifier: (value: string) => ValueT;
  label: string;
  choices?: ChoiceType[];
}

export interface SetterFieldOwnProps<ValueT, StateT>
  extends FieldDefinition<ValueT, StateT> {
  defaultValue?: ValueT;
  setter: (state: { [key: string]: ValueT }) => void;
}

export type SetterFieldProps<ValueT, StateT> = SetterFieldOwnProps<
  ValueT,
  StateT
> &
  TextFieldProps;

export const SetterField = <ValueT, StateT>({
  field,
  modifier,
  setter,
  choices,
  ...props
}: SetterFieldProps<ValueT, StateT>): React.ReactElement => {
  const setField = (value: ValueT) => {
    setter({ [field]: value });
  };

  const onBlur =
    choices === undefined
      ? (event: FocusEvent<HTMLInputElement>) => {
          setField(modifier(event.target?.value));
        }
      : undefined;

  const onKeyUp =
    choices === undefined
      ? (event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key == 'Enter')
            setField(modifier((event.target as HTMLInputElement)?.value));
        }
      : undefined;

  const onChange =
    choices === undefined
      ? undefined
      : (event: ChangeEvent<HTMLInputElement>) => {
          setField(modifier(event.target?.value));
        };

  return (
    <TextField
      id={`${field}-input`}
      name={field as string}
      {...props}
      onBlur={onBlur}
      onKeyUp={onKeyUp}
      onChange={onChange}
      select={choices !== undefined}
    >
      {choices?.map(({ label, value }) => (
        <MenuItem key={label} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export interface SetterCheckboxOwnProps<StateT> {
  field: keyof StateT;
  label: string;
  checked?: boolean;
  setter: (state: { [key: string]: boolean }) => void;
}

export type SetterCheckboxProps<StateT> = SetterCheckboxOwnProps<StateT> &
  Partial<FormControlLabelProps>;

export const SetterCheckbox = <StateT,>({
  field,
  setter,
  checked,
  ...props
}: SetterCheckboxProps<StateT>): React.ReactElement => {
  const setField = (value: boolean) => {
    setter({ [field]: value });
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setField(event.target?.checked);
  };

  return (
    <FormControlLabel
      {...props}
      control={
        <Checkbox
          id={`${field}-input`}
          checked={checked}
          color="primary"
          onChange={onChange}
        />
      }
    />
  );
};
