import { Button, Card, CardActions, CardContent, CardHeader, Container, FormControl, Grid, InputLabel } from '@mui/material';
import { ChangeEvent, SyntheticEvent, useCallback, useState } from 'react';
import { Auth } from 'aws-amplify';
import BoxShadowOutlinedInput from '../components/BoxShadowOutlinedInput';
import PasswordField from '../components/PasswordField';

function RequiredSignUpField({ children }: { children: JSX.Element[] }) {
  return (
    <FormControl fullWidth margin="dense" required>
      {children}
    </FormControl>
  );
}

export default function SignUp() {
  const [signUpFormData, setSignUpFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    emailAddress: '',
    password: '',
  });
  const fieldChangeHandler = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const fieldName = event.target.name;
      setSignUpFormData((prevState) => {
        return {
          ...prevState,
          [fieldName]: event.target.value,
        };
      });
    },
    [setSignUpFormData]
  );
  const signUp = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      await Auth.signUp({
        username: signUpFormData.username,
        password: signUpFormData.password,
        attributes: {
          email: signUpFormData.emailAddress,
          given_name: signUpFormData.firstName,
          family_name: signUpFormData.lastName,
        },
      });
    },
    [signUpFormData]
  );

  const signUpDataValid = () => !signUpFormData.firstName || !signUpFormData.lastName || !signUpFormData.username || !signUpFormData.emailAddress || !signUpFormData.password;

  return (
    <Container maxWidth="sm">
      <Card raised component="form" onSubmit={signUp} aria-label="Sign Up Form">
        <CardHeader title="Sign Up" />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item sm={6} xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="first-name-field">First Name</InputLabel>
                <BoxShadowOutlinedInput id="first-name-field" name="firstName" label="First Name" autoComplete="given-name" onChange={fieldChangeHandler} />
              </RequiredSignUpField>
            </Grid>
            <Grid item sm={6} xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="last-name-field">Last Name</InputLabel>
                <BoxShadowOutlinedInput id="last-name-field" name="lastName" label="Last Name" autoComplete="family-name" onChange={fieldChangeHandler} />
              </RequiredSignUpField>
            </Grid>
            <Grid item xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="username-field">Username</InputLabel>
                <BoxShadowOutlinedInput id="username-field" name="username" label="Username" autoComplete="username" onChange={fieldChangeHandler} />
              </RequiredSignUpField>
            </Grid>
            <Grid item xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="email-address-field">Email Address</InputLabel>
                <BoxShadowOutlinedInput id="email-address-field" name="emailAddress" label="Email Address" type="email" autoComplete="email" onChange={fieldChangeHandler} />
              </RequiredSignUpField>
            </Grid>
            <Grid item xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="password-field">Password</InputLabel>
                <PasswordField id="password-field" name="password" autoComplete="new-password" onChange={fieldChangeHandler} />
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
