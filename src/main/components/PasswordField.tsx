import { IconButton, InputAdornment, OutlinedInputProps } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ChangeEvent, useCallback, useState } from 'react';
import BoxShadowOutlinedInput from './BoxShadowOutlinedInput';

export default function PasswordField(props: OutlinedInputProps) {
  const { onChange } = props;
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const passwordChangeHandler = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setPassword(event.target.value);
      if (onChange) {
        onChange(event);
      }
    },
    [setPassword, onChange]
  );

  const showPasswordClickHandler = useCallback(() => {
    setPasswordVisible(!passwordVisible);
  }, [passwordVisible]);

  return (
    <BoxShadowOutlinedInput
      label="Password"
      value={password}
      type={passwordVisible ? 'text' : 'password'}
      onChange={passwordChangeHandler}
      endAdornment={
        <InputAdornment position="end">
          <IconButton aria-label={`${passwordVisible ? 'Hide' : 'Show'} Password`} onClick={showPasswordClickHandler}>
            {passwordVisible ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      {...props}
    />
  );
}
