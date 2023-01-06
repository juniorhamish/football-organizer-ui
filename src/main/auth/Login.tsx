import { Backdrop, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, FormControl, FormHelperText, Grid, InputLabel } from '@mui/material';
import { useCallback, useId, useState } from 'react';
import { Auth } from 'aws-amplify';
import { SubmitHandler, useForm } from 'react-hook-form';
import { User } from './User';
import BoxShadowOutlinedInput from '../components/BoxShadowOutlinedInput';
import PasswordField from '../components/PasswordField';

type LoginInputs = {
  username: string;
  password: string;
};

export default function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const baseId = useId();
  const [showLoginFailedMessage, setShowLoginFailedMessage] = useState(false);
  const errorMessageFieldId = `${baseId}ErrorMessageField`;
  const login: SubmitHandler<LoginInputs> = useCallback(
    async (data) => {
      try {
        onLogin(await Auth.signIn(data.username, data.password));
      } catch (e) {
        setShowLoginFailedMessage(true);
      }
    },
    [onLogin]
  );
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<LoginInputs>({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const hideLoginFailedMessage = useCallback(() => {
    setShowLoginFailedMessage(false);
  }, [setShowLoginFailedMessage]);
  const usernameField = register('username', { required: true, onChange: hideLoginFailedMessage });
  const passwordField = register('password', { required: true, onChange: hideLoginFailedMessage });

  return (
    <>
      <Backdrop open={isSubmitting} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress aria-label="Login in progress" />
      </Backdrop>
      <Container maxWidth="sm">
        <Card raised component="form" onSubmit={handleSubmit(login)} aria-label="Sign In Form" aria-busy={isSubmitting}>
          <CardHeader title="Sign In" />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel htmlFor="username-field">Username</InputLabel>
                  <BoxShadowOutlinedInput
                    id="username-field"
                    name={usernameField.name}
                    label="Username"
                    autoComplete="username"
                    error={showLoginFailedMessage}
                    onChange={usernameField.onChange}
                    onBlur={usernameField.onBlur}
                    ref={usernameField.ref}
                    inputProps={showLoginFailedMessage ? { 'aria-errormessage': errorMessageFieldId } : {}}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel htmlFor="password-field">Password</InputLabel>
                  <PasswordField
                    id="password-field"
                    name={passwordField.name}
                    error={showLoginFailedMessage}
                    onChange={passwordField.onChange}
                    onBlur={passwordField.onBlur}
                    ref={passwordField.ref}
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
            <Button type="submit" disabled={isSubmitting || !isValid}>
              Submit
            </Button>
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
