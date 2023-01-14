import { Backdrop, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, FormControl, FormHelperText, Grid, InputLabel } from '@mui/material';
import { SyntheticEvent, useCallback, useId, useState } from 'react';
import { Auth } from 'aws-amplify';
import { User } from './User';
import BoxShadowOutlinedInput from '../components/BoxShadowOutlinedInput';
import PasswordField from '../components/PasswordField';
import useFormState from '../functional/useFormState';

export default function Login({ onLogin, userNotConfirmed }: { onLogin: (user: User) => void; userNotConfirmed: (username: string) => void }) {
  const baseId = useId();
  const [showLoginFailedMessage, setShowLoginFailedMessage] = useState(false);
  const [showUserDoesNotExistMessage, setShowUserDoesNotExistMessage] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const hideErrors = () => {
    setShowLoginFailedMessage(false);
    setShowUserDoesNotExistMessage(false);
  };
  const {
    values: { username, password },
    onChange,
  } = useFormState(
    {
      username: '',
      password: '',
    },
    hideErrors
  );
  const userNameErrorMessageFieldId = `${baseId}UserNameErrorMessageField`;
  const passwordErrorMessageFieldId = `${baseId}PasswordErrorMessageField`;
  const login = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      setLoginInProgress(true);
      try {
        onLogin(await Auth.signIn(username, password));
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'UserNotConfirmedException') {
            userNotConfirmed(username);
          } else if (error.name === 'UserNotFoundException') {
            setShowUserDoesNotExistMessage(true);
          } else {
            setShowLoginFailedMessage(true);
          }
        }
      } finally {
        setLoginInProgress(false);
      }
    },
    [onLogin, userNotConfirmed, username, password]
  );

  return (
    <>
      <Backdrop open={loginInProgress} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress aria-label="Login in progress" />
      </Backdrop>
      <Container maxWidth="sm">
        <Card raised component="form" onSubmit={login} aria-label="Sign In Form" aria-busy={loginInProgress}>
          <CardHeader title="Sign In" />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormControl error={showUserDoesNotExistMessage} fullWidth margin="dense">
                  <InputLabel htmlFor="username-field">Username</InputLabel>
                  <BoxShadowOutlinedInput
                    id="username-field"
                    name="username"
                    label="Username"
                    autoComplete="username"
                    value={username}
                    onChange={onChange}
                    inputProps={showUserDoesNotExistMessage ? { 'aria-errormessage': userNameErrorMessageFieldId } : {}}
                  />
                  {showUserDoesNotExistMessage && <FormHelperText id={userNameErrorMessageFieldId}>User does not exist</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl error={showLoginFailedMessage} fullWidth margin="dense">
                  <InputLabel htmlFor="password-field">Password</InputLabel>
                  <PasswordField
                    id="password-field"
                    name="password"
                    value={password}
                    onChange={onChange}
                    inputProps={{ 'aria-errormessage': showLoginFailedMessage ? passwordErrorMessageFieldId : undefined }}
                  />
                  {showLoginFailedMessage && <FormHelperText id={passwordErrorMessageFieldId}>Login failed</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button type="submit" disabled={!username || !password}>
              Submit
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
