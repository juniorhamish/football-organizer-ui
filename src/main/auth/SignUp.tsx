import { Button, CardActions, CardContent, CardHeader, FormControl, Grid, InputLabel } from '@mui/material';
import { SyntheticEvent, useCallback } from 'react';
import { Auth } from 'aws-amplify';
import useFormState from '../functional/useFormState';
import { BoxShadowOutlinedInput, FormCard, FormContainer, FormControlField, FormGrid, PasswordField } from '../components';

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
    <FormContainer>
      <FormCard onSubmit={signUp} aria-label="Sign Up Form">
        <CardHeader title="Sign Up" />
        <CardContent>
          <FormGrid>
            <Grid item sm={6} xs={12}>
              <FormControlField required>
                <InputLabel htmlFor="first-name-field">First Name</InputLabel>
                <BoxShadowOutlinedInput id="first-name-field" name="firstName" label="First Name" autoComplete="given-name" onChange={onChange} />
              </FormControlField>
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControlField required>
                <InputLabel htmlFor="last-name-field">Last Name</InputLabel>
                <BoxShadowOutlinedInput id="last-name-field" name="lastName" label="Last Name" autoComplete="family-name" onChange={onChange} />
              </FormControlField>
            </Grid>
            <Grid item xs={12}>
              <FormControlField required>
                <InputLabel htmlFor="username-field">Username</InputLabel>
                <BoxShadowOutlinedInput id="username-field" name="username" label="Username" autoComplete="username" onChange={onChange} />
              </FormControlField>
            </Grid>
            <Grid item xs={12}>
              <FormControlField required>
                <InputLabel htmlFor="email-address-field">Email Address</InputLabel>
                <BoxShadowOutlinedInput id="email-address-field" name="emailAddress" label="Email Address" type="email" autoComplete="email" onChange={onChange} />
              </FormControlField>
            </Grid>
            <Grid item xs={12}>
              <FormControlField required>
                <InputLabel htmlFor="password-field">Password</InputLabel>
                <PasswordField id="password-field" name="password" autoComplete="new-password" onChange={onChange} />
              </FormControlField>
            </Grid>
          </FormGrid>
        </CardContent>
        <CardActions>
          <FormControl>
            <Button type="submit" disabled={signUpDataValid()}>
              Submit
            </Button>
          </FormControl>
        </CardActions>
      </FormCard>
    </FormContainer>
  );
}
