import { Backdrop, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, FormControl, FormHelperText, Grid, InputLabel } from '@mui/material';
import { useCallback, useId } from 'react';
import { Auth } from 'aws-amplify';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { User } from './User';
import BoxShadowOutlinedInput from '../components/BoxShadowOutlinedInput';
import PasswordField from '../components/PasswordField';

type LoginInputs = {
  username: string;
  password: string;
};

export default function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const baseId = useId();
  const errorMessageFieldId = `${baseId}ErrorMessageField`;
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, isValid, errors, isSubmitSuccessful, isSubmitted },
  } = useForm<LoginInputs>({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const highlightFields = () => isSubmitted && !isSubmitSuccessful;
  const hideErrors = useCallback(() => reset({}, { keepValues: true }), [reset]);
  const usernameField = register('username', { required: true, onChange: hideErrors });
  const passwordField = register('password', { required: true, onChange: hideErrors });
  const login: SubmitHandler<LoginInputs> = useCallback(
    async (data) => {
      try {
        onLogin(await Auth.signIn(data.username, data.password));
      } catch (e) {
        setError(passwordField.name, { type: 'custom', message: 'Login failed' });
      }
    },
    [onLogin, setError, passwordField]
  );

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
                    error={highlightFields()}
                    onChange={usernameField.onChange}
                    ref={usernameField.ref}
                    inputProps={highlightFields() ? { 'aria-errormessage': errorMessageFieldId } : {}}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel htmlFor="password-field">Password</InputLabel>
                  <PasswordField
                    id="password-field"
                    name={passwordField.name}
                    error={highlightFields()}
                    onChange={passwordField.onChange}
                    ref={passwordField.ref}
                    inputProps={{ 'aria-errormessage': highlightFields() ? errorMessageFieldId : undefined }}
                  />
                </FormControl>
              </Grid>
              <ErrorMessage
                name={passwordField.name}
                errors={errors}
                render={({ message }) => (
                  <Grid item xs={12}>
                    <FormHelperText error id={errorMessageFieldId}>
                      {message}
                    </FormHelperText>
                  </Grid>
                )}
              />
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
