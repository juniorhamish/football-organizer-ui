import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ChangeEvent, ChangeEventHandler, forwardRef, useCallback, useState } from 'react';
import { InputBaseComponentProps } from '@mui/material/InputBase/InputBase';
import BoxShadowOutlinedInput from './BoxShadowOutlinedInput';

type PasswordFieldProps = {
  id: string;
  name?: string;
  error?: boolean;
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
  inputProps?: InputBaseComponentProps;
  autoComplete?: string;
};

const PasswordField = forwardRef(({ id, name, error, onChange, inputProps, autoComplete }: PasswordFieldProps, ref) => {
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
      ref={ref}
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
});

PasswordField.defaultProps = {
  error: false,
  inputProps: {},
  autoComplete: 'password',
  name: undefined,
};

export default PasswordField;
