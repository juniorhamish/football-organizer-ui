import { Button, CardActions, CardContent, CardHeader, FormHelperText, Grid, InputLabel } from '@mui/material';
import { SyntheticEvent, useCallback, useId, useState } from 'react';
import { Auth } from 'aws-amplify';
import { User } from './User';
import useFormState from '../functional/useFormState';
import { FormContainer, FormCard, FormGrid, FormControlField, ProgressIndicator, BoxShadowOutlinedInput, PasswordField } from '../components';

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
      <FormContainer>
        <FormCard onSubmit={signIn} aria-label="Sign In Form" aria-busy={signInInProgress}>
          <CardHeader title="Sign In" />
          <CardContent>
            <FormGrid>
              <Grid item xs={12}>
                <FormControlField error={showUserDoesNotExistMessage}>
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
                </FormControlField>
              </Grid>
              <Grid item xs={12}>
                <FormControlField error={showSignInFailedMessage}>
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
                </FormControlField>
              </Grid>
            </FormGrid>
          </CardContent>
          <CardActions>
            <Button type="submit" disabled={!username || !password}>
              Submit
            </Button>
          </CardActions>
        </FormCard>
      </FormContainer>
    </>
  );
}
