import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const signInForm = () => screen.getByRole('form', { name: 'Sign In Form' });
export const usernameField = () => within(signInForm()).getByRole('textbox', { name: 'Username' });
export const passwordField = () => within(signInForm()).getByLabelText('Password');
export const submitButton = () => within(signInForm()).getByRole('button', { name: 'Submit' });
export const enterUsername = async (username: string) => userEvent.type(usernameField(), username);
export const enterPassword = async (password: string) => userEvent.type(passwordField(), password);
export const showPasswordButton = () => within(signInForm()).getByRole('button', { name: 'Show Password' });
export const hidePasswordButton = () => within(signInForm()).getByRole('button', { name: 'Hide Password' });
export const submitLogin = async (username: string, password: string) => {
  await enterUsername(username);
  await enterPassword(password);
  await userEvent.click(submitButton());
};
export const userNotConfirmedError = () => {
  const error = new Error('User is not confirmed');
  error.name = 'UserNotConfirmedException';
  return error;
};
