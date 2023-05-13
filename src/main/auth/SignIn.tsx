import { Button, Card, CardActions, CardContent, CardHeader, Container, FormControl, FormHelperText, Grid, InputLabel } from '@mui/material';
import { SyntheticEvent, useCallback, useId, useState } from 'react';
import { Auth } from 'aws-amplify';
import { User } from './User';
import BoxShadowOutlinedInput from '../components/BoxShadowOutlinedInput';
import PasswordField from '../components/PasswordField';
import useFormState from '../functional/useFormState';
import ProgressIndicator from '../components/ProgressIndicator';

export default function SignIn({ onSignIn, userNotConfirmed }: { onSignIn: (user: User) => void; userNotConfirmed: (username: string) => void }) {
  const baseId = useId();
  const [showSignInFailedMessage, setShowSignInFailedMessage] = useState(false);
  const [showUserDoesNotExistMessage, setShowUserDoesNotExistMessage] = useState(false);
  const [signInInProgress, setSignInInProgress] = useState(false);
  const hideErrors = () => {
    setShowSignInFailedMessage(false);
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
  const signIn = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      setSignInInProgress(true);
      try {
        onSignIn(await Auth.signIn(username, password));
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'UserNotConfirmedException') {
            userNotConfirmed(username);
          } else if (error.name === 'UserNotFoundException') {
            setShowUserDoesNotExistMessage(true);
          } else {
            setShowSignInFailedMessage(true);
          }
        }
      } finally {
        setSignInInProgress(false);
      }
    },
    [onSignIn, userNotConfirmed, username, password]
  );

  return (
    <>
      <ProgressIndicator open={signInInProgress} label="Sign in in progress" />
      <Container maxWidth="sm">
        <Card raised component="form" onSubmit={signIn} aria-label="Sign In Form" aria-busy={signInInProgress}>
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
                <FormControl error={showSignInFailedMessage} fullWidth margin="dense">
                  <InputLabel htmlFor="password-field">Password</InputLabel>
                  <PasswordField
                    id="password-field"
                    name="password"
                    value={password}
                    onChange={onChange}
                    autoComplete="current-password"
                    inputProps={{ 'aria-errormessage': showSignInFailedMessage ? passwordErrorMessageFieldId : undefined }}
                  />
                  {showSignInFailedMessage && <FormHelperText id={passwordErrorMessageFieldId}>Sign in failed</FormHelperText>}
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
