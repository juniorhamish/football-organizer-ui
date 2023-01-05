import { Backdrop, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, FormControl, FormHelperText, Grid, InputLabel } from '@mui/material';
import { SyntheticEvent, useCallback, useId, useState } from 'react';
import { Auth } from 'aws-amplify';
import { User } from './User';
import BoxShadowOutlinedInput from '../components/BoxShadowOutlinedInput';
import PasswordField from '../components/PasswordField';

export default function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const baseId = useId();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginFailedMessage, setShowLoginFailedMessage] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const errorMessageFieldId = `${baseId}ErrorMessageField`;

  const login = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      setLoginInProgress(true);
      try {
        onLogin(await Auth.signIn(username, password));
      } catch (e) {
        setShowLoginFailedMessage(true);
      } finally {
        setLoginInProgress(false);
      }
    },
    [onLogin, username, password]
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
                <FormControl fullWidth margin="dense">
                  <InputLabel htmlFor="username-field">Username</InputLabel>
                  <BoxShadowOutlinedInput
                    id="username-field"
                    label="Username"
                    autoComplete="username"
                    value={username}
                    error={showLoginFailedMessage}
                    onChange={(event) => {
                      setShowLoginFailedMessage(false);
                      setUsername(event.target.value);
                    }}
                    inputProps={showLoginFailedMessage ? { 'aria-errormessage': errorMessageFieldId } : {}}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel htmlFor="password-field">Password</InputLabel>
                  <PasswordField
                    id="password-field"
                    error={showLoginFailedMessage}
                    onChange={(event) => {
                      setShowLoginFailedMessage(false);
                      setPassword(event.target.value);
                    }}
                    inputProps={{ 'aria-errormessage': showLoginFailedMessage ? errorMessageFieldId : undefined }}
                  />
                </FormControl>
              </Grid>
              {showLoginFailedMessage && (
                <Grid item xs={12}>
                  <FormHelperText error id={errorMessageFieldId}>
                    Login failed
                  </FormHelperText>
                </Grid>
              )}
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
