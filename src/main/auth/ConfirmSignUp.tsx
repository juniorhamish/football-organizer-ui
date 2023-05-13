import { Button, CardActions, CardContent, CardHeader, Grid, InputLabel } from '@mui/material';
import { SyntheticEvent, useCallback } from 'react';
import { Auth } from 'aws-amplify';
import { useLocation } from 'react-router-dom';
import useFormState from '../functional/useFormState';
import { BoxShadowOutlinedInput, FormCard, FormContainer, FormControlField, FormGrid } from '../components';

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
    <FormContainer>
      <FormCard aria-label="Confirm Sign Up Form" onSubmit={confirmSignUp}>
        <CardHeader title="Confirm Sign Up" subheader={`Enter the code that was sent to the email address you provided at registration for user ${username}`} />
        <CardContent>
          <FormGrid>
            <Grid item xs={12}>
              <FormControlField required>
                <InputLabel htmlFor="code-field">Code</InputLabel>
                <BoxShadowOutlinedInput id="code-field" name="code" label="Code" value={code} onChange={onChange} />
              </FormControlField>
            </Grid>
          </FormGrid>
        </CardContent>
        <CardActions>
          <Button type="submit" disabled={!code}>
            Confirm
          </Button>
          <Button onClick={resendCode}>Resend Code</Button>
        </CardActions>
      </FormCard>
    </FormContainer>
  );
}
