import { Button, Card, CardActions, CardContent, CardHeader, Container, FormControl, Grid, InputLabel } from '@mui/material';
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
  return (
    <Container maxWidth="sm">
      <Card raised component="form" aria-label="Sign Up Form">
        <CardHeader title="Sign Up" />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item sm={6} xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="first-name-field">First Name</InputLabel>
                <BoxShadowOutlinedInput id="first-name-field" label="First Name" autoComplete="given-name" />
              </RequiredSignUpField>
            </Grid>
            <Grid item sm={6} xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="last-name-field">Last Name</InputLabel>
                <BoxShadowOutlinedInput id="last-name-field" label="Last Name" autoComplete="family-name" />
              </RequiredSignUpField>
            </Grid>
            <Grid item xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="username-field">Username</InputLabel>
                <BoxShadowOutlinedInput id="username-field" label="Username" autoComplete="username" />
              </RequiredSignUpField>
            </Grid>
            <Grid item xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="email-address-field">Email Address</InputLabel>
                <BoxShadowOutlinedInput id="email-address-field" label="Email Address" type="email" autoComplete="email" />
              </RequiredSignUpField>
            </Grid>
            <Grid item xs={12}>
              <RequiredSignUpField>
                <InputLabel htmlFor="password-field">Password</InputLabel>
                <PasswordField id="password-field" autoComplete="new-password" />
              </RequiredSignUpField>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <FormControl>
            <Button type="submit">Submit</Button>
          </FormControl>
        </CardActions>
      </Card>
    </Container>
  );
}
