import { IconButton, InputAdornment, InputBaseComponentProps } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ChangeEvent, ChangeEventHandler, useCallback, useState } from 'react';
import BoxShadowOutlinedInput from './BoxShadowOutlinedInput';

type PasswordFieldProps = {
  id: string;
  name?: string;
  error?: boolean;
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  inputProps?: InputBaseComponentProps;
  autoComplete?: string;
};

export default function PasswordField({ id, name, error, onChange, inputProps, autoComplete }: PasswordFieldProps) {
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const passwordChangeHandler = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPassword(event.target.value);
      onChange(event);
    },
    [setPassword, onChange]
  );

  const showPasswordClickHandler = useCallback(() => {
    setPasswordVisible(!passwordVisible);
  }, [passwordVisible]);

  return (
    <BoxShadowOutlinedInput
      id={id}
      name={name}
      label="Password"
      error={error}
      value={password}
      type={passwordVisible ? 'text' : 'password'}
      autoComplete={autoComplete}
      onChange={passwordChangeHandler}
      inputProps={inputProps}
      endAdornment={
        <InputAdornment position="end">
          <IconButton aria-label={`${passwordVisible ? 'Hide' : 'Show'} Password`} onClick={showPasswordClickHandler}>
            {passwordVisible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
}

PasswordField.defaultProps = {
  error: false,
  inputProps: {},
  autoComplete: 'password',
  name: undefined,
};
