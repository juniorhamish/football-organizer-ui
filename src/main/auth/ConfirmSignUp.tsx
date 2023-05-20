import { Button, CardActions, CardContent, CardHeader, FormHelperText, Grid, InputLabel } from '@mui/material';
import { SyntheticEvent, useCallback, useId, useState } from 'react';
import { Auth } from 'aws-amplify';
import { useLocation } from 'react-router-dom';
import useFormState from '../functional/useFormState';
import { BoxShadowOutlinedInput, FormCard, FormContainer, FormControlField, FormGrid, ProgressIndicator } from '../components';

export default function ConfirmSignUp({ onConfirm }: { onConfirm: () => void }) {
  const baseId = useId();
  const [confirmSignupInProgress, setConfirmSignupInProgress] = useState(false);
  const [resendCodeInProgress, setResendCodeInProgress] = useState(false);
  const [showInvalidCodeMessage, setShowInvalidCodeMessage] = useState(false);
  const {
    state: { username },
  } = useLocation();
  const {
    values: { code },
    onChange,
  } = useFormState({ code: '' }, () => setShowInvalidCodeMessage(false));

  const invalidCodeErrorMessageFieldId = `${baseId}PasswordErrorMessageField`;

  const confirmSignUp = useCallback(
    async (event: SyntheticEvent) => {
      setConfirmSignupInProgress(true);
      event.preventDefault();
      try {
        await Auth.confirmSignUp(username, code);
        onConfirm();
      } catch (error) {
        setShowInvalidCodeMessage(true);
      } finally {
        setConfirmSignupInProgress(false);
      }
    },
    [code, username, onConfirm]
  );

  const resendCode = useCallback(async () => {
    setResendCodeInProgress(true);
    try {
      await Auth.resendSignUp(username);
    } catch (e) {
      /* empty */
    } finally {
      setResendCodeInProgress(false);
    }
  }, [username]);

  return (
    <>
      <ProgressIndicator open={confirmSignupInProgress} label="Confirm sign up in progress" />
      <ProgressIndicator open={resendCodeInProgress} label="Resend confirmation code request in progress" />
      <FormContainer>
        <FormCard aria-label="Confirm Sign Up Form" onSubmit={confirmSignUp} aria-busy={confirmSignupInProgress || resendCodeInProgress}>
          <CardHeader title="Confirm Sign Up" subheader={`Enter the code that was sent to the email address you provided at registration for user ${username}`} />
          <CardContent>
            <FormGrid>
              <Grid item xs={12}>
                <FormControlField required error={showInvalidCodeMessage}>
                  <InputLabel htmlFor="code-field">Code</InputLabel>
                  <BoxShadowOutlinedInput
                    id="code-field"
                    name="code"
                    label="Code"
                    value={code}
                    onChange={onChange}
                    inputProps={showInvalidCodeMessage ? { 'aria-errormessage': invalidCodeErrorMessageFieldId } : {}}
                  />
                  {showInvalidCodeMessage && <FormHelperText id={invalidCodeErrorMessageFieldId}>Invalid code</FormHelperText>}
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
    </>
  );
}
