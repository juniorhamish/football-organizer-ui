import { Button, Card, CardActions, CardContent, CardHeader, Container, FormControl, Grid, InputLabel } from '@mui/material';
import { SyntheticEvent, useCallback } from 'react';
import { Auth } from 'aws-amplify';
import { useLocation } from 'react-router-dom';
import BoxShadowOutlinedInput from '../components/BoxShadowOutlinedInput';
import useFormState from '../functional/useFormState';

export default function ConfirmSignUp({ onConfirm }: { onConfirm: () => void }) {
  const {
    state: { username },
  } = useLocation();
  const {
    values: { code },
    onChange,
  } = useFormState({ code: '' });

  const confirmSignUp = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      await Auth.confirmSignUp(username, code);
      onConfirm();
    },
    [code, username, onConfirm]
  );

  const resendCode = useCallback(async () => {
    await Auth.resendSignUp(username);
  }, [username]);

  return (
    <Container maxWidth="sm">
      <Card raised component="form" aria-label="Confirm Sign Up Form" onSubmit={confirmSignUp}>
        <CardHeader title="Confirm Sign Up" subheader="Enter the code that was sent to the email address you provided at registration" />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense" required>
                <InputLabel htmlFor="code-field">Code</InputLabel>
                <BoxShadowOutlinedInput id="code-field" name="code" label="Code" value={code} onChange={onChange} />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button type="submit" disabled={!code}>
            Confirm
          </Button>
          <Button onClick={resendCode}>Resend Code</Button>
        </CardActions>
      </Card>
    </Container>
  );
}
