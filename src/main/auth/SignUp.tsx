import { Button, Card, CardActions, CardContent, CardHeader, Container, FormControl, Grid, InputLabel } from '@mui/material';
import { SyntheticEvent, useCallback } from 'react';
import { Auth } from 'aws-amplify';
import BoxShadowOutlinedInput from '../components/BoxShadowOutlinedInput';
import PasswordField from '../components/PasswordField';
import useFormState from '../functional/useFormState';

function RequiredSignUpField({ children }: { children: JSX.Element[] }) {
  return (
    <FormControl fullWidth margin="dense" required>
      {children}
    </FormControl>
  );
}

export default function SignUp({ onSignUp }: { onSignUp: (username: string) => void }) {
  const {
    values: { firstName, lastName, username, emailAddress, password },
    onChange,
  } = useFormState({
    firstName: '',
    lastName: '',
    username: '',
    emailAddress: '',
    password: '',
  });
  const signUp = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      try {
        await Auth.signUp({
          username,
          password,
          attributes: {
            email: emailAddress,
            given_name: firstName,
            family_name: lastName,
          },
          autoSignIn: {
            enabled: true,
          },
        });
        onSignUp(username);
      } catch (e) {
        /* empty */
      }
    },
    [username, password, emailAddress, firstName, lastName, onSignUp]
  );

  const signUpDataValid = () => !firstName || !lastName || !username || !emailAddress || !password;

  return (
    <Container maxWidth="sm">
      <Card raised component="form" onSubmit={signUp} aria-label="Sign Up Form">
        <CardHeader title="Sign Up" />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item sm={6} xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="first-name-field">First Name</InputLabel>
                <BoxShadowOutlinedInput id="first-name-field" name="firstName" label="First Name" autoComplete="given-name" onChange={onChange} />
              </RequiredSignUpField>
            </Grid>
            <Grid item sm={6} xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="last-name-field">Last Name</InputLabel>
                <BoxShadowOutlinedInput id="last-name-field" name="lastName" label="Last Name" autoComplete="family-name" onChange={onChange} />
              </RequiredSignUpField>
            </Grid>
            <Grid item xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="username-field">Username</InputLabel>
                <BoxShadowOutlinedInput id="username-field" name="username" label="Username" autoComplete="username" onChange={onChange} />
              </RequiredSignUpField>
            </Grid>
            <Grid item xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="email-address-field">Email Address</InputLabel>
                <BoxShadowOutlinedInput id="email-address-field" name="emailAddress" label="Email Address" type="email" autoComplete="email" onChange={onChange} />
              </RequiredSignUpField>
            </Grid>
            <Grid item xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="password-field">Password</InputLabel>
                <PasswordField id="password-field" name="password" autoComplete="new-password" onChange={onChange} />
              </RequiredSignUpField>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <FormControl>
            <Button type="submit" disabled={signUpDataValid()}>
              Submit
            </Button>
          </FormControl>
        </CardActions>
      </Card>
    </Container>
  );
}
