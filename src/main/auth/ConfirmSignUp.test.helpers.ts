import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const confirmSignUpForm = () => screen.getByRole('form', { name: 'Confirm Sign Up Form' });
export const codeField = () => within(confirmSignUpForm()).getByRole('textbox', { name: 'Code' });
export const confirmButton = () => within(confirmSignUpForm()).getByRole('button', { name: 'Confirm' });
export const resendCodeButton = () => within(confirmSignUpForm()).getByRole('button', { name: 'Resend Code' });
export const confirmSignUp = async (code: string) => {
  await userEvent.type(codeField(), code);
  await userEvent.click(confirmButton());
};
export const confirmSignupFailedError = () => {
  const error = new Error();
  error.name = 'CodeMismatchException';
  return error;
};
