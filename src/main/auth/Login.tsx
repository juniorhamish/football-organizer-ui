import { Backdrop, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, FormControl, FormHelperText, Grid, InputLabel } from '@mui/material';
import { ChangeEvent, SyntheticEvent, useCallback, useId, useState } from 'react';
import { Auth } from 'aws-amplify';
import { User } from './User';
import BoxShadowOutlinedInput from '../components/BoxShadowOutlinedInput';
import PasswordField from '../components/PasswordField';

export default function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const baseId = useId();
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: '',
  });
  const [showLoginFailedMessage, setShowLoginFailedMessage] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const errorMessageFieldId = `${baseId}ErrorMessageField`;

  const fieldChangeHandler = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setShowLoginFailedMessage(false);
      const fieldName = event.target.name;
      setLoginFormData((prevState) => {
        return {
          ...prevState,
          [fieldName]: event.target.value,
        };
      });
    },
    [setLoginFormData, setShowLoginFailedMessage]
  );
  const login = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      setLoginInProgress(true);
      try {
        onLogin(await Auth.signIn(loginFormData.username, loginFormData.password));
      } catch (e) {
        setShowLoginFailedMessage(true);
      } finally {
        setLoginInProgress(false);
      }
    },
    [onLogin, loginFormData]
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
                    name="username"
                    label="Username"
                    autoComplete="username"
                    value={loginFormData.username}
                    error={showLoginFailedMessage}
                    onChange={fieldChangeHandler}
                    inputProps={showLoginFailedMessage ? { 'aria-errormessage': errorMessageFieldId } : {}}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel htmlFor="password-field">Password</InputLabel>
                  <PasswordField
                    id="password-field"
                    name="password"
                    error={showLoginFailedMessage}
                    onChange={fieldChangeHandler}
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
            <Button type="submit" disabled={!loginFormData.username || !loginFormData.password}>
              Submit
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
