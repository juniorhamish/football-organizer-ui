import { IconButton, InputAdornment, OutlinedInputProps } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useCallback, useState } from 'react';
import BoxShadowOutlinedInput from './BoxShadowOutlinedInput';

export default function PasswordField(props: OutlinedInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const showPasswordClickHandler = useCallback(() => {
    setPasswordVisible(!passwordVisible);
  }, [passwordVisible]);

  return (
    <BoxShadowOutlinedInput
      label="Password"
      type={passwordVisible ? 'text' : 'password'}
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
