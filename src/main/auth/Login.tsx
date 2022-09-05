import { Backdrop, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, FormControl, FormHelperText, IconButton, InputAdornment, TextField } from '@mui/material';
import { SyntheticEvent, useId, useRef, useState } from 'react';
import { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const formFieldStyle = { padding: 1 };
const textFieldStyle = {
  boxShadow: 8,
  borderRadius: 1,
};

export default function Login({ onLogin }: { onLogin: (user: CognitoUser) => void }) {
  const userNameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const baseId = useId();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showLoginFailedMessage, setShowLoginFailedMessage] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const errorMessageFieldId = `${baseId}ErrorMessageField`;

  const login = (event: SyntheticEvent) => {
    event.preventDefault();
    setLoginInProgress(true);
    Auth.signIn(userNameRef.current?.value as string, passwordRef.current?.value)
      .then((user) => {
        onLogin(user);
      })
      .catch(() => {
        setShowLoginFailedMessage(true);
      })
      .finally(() => setLoginInProgress(false));
  };
  return (
    <>
      <Backdrop open={loginInProgress} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress aria-label="Login in progress" />
      </Backdrop>
      <Container maxWidth="sm">
        <Card raised>
          <CardHeader title="Sign In" />
          <form onSubmit={login} aria-label="Sign In Form" aria-busy={loginInProgress}>
            <CardContent>
              <FormControl fullWidth sx={formFieldStyle}>
                <TextField
                  error={showLoginFailedMessage}
                  inputProps={showLoginFailedMessage ? { 'aria-errormessage': errorMessageFieldId } : {}}
                  label="Username"
                  inputRef={userNameRef}
                  sx={textFieldStyle}
                  onChange={() => setShowLoginFailedMessage(false)}
                />
              </FormControl>
              <FormControl fullWidth sx={formFieldStyle}>
                <TextField
                  label="Password"
                  error={showLoginFailedMessage}
                  inputRef={passwordRef}
                  type={passwordVisible ? 'text' : 'password'}
                  sx={textFieldStyle}
                  onChange={() => setShowLoginFailedMessage(false)}
                  InputProps={{
                    inputProps: showLoginFailedMessage ? { 'aria-errormessage': errorMessageFieldId } : {},
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label={`${passwordVisible ? 'Hide' : 'Show'} Password`} onClick={() => setPasswordVisible(!passwordVisible)}>
                          {passwordVisible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              {showLoginFailedMessage && (
                <FormHelperText error id={errorMessageFieldId}>
                  Login failed
                </FormHelperText>
              )}
            </CardContent>
            <CardActions>
              <Button type="submit">Submit</Button>
            </CardActions>
          </form>
        </Card>
      </Container>
    </>
  );
}
