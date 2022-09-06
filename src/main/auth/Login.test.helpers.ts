import { RenderResult, within } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/setup/setup';

export default (renderResult: RenderResult, user: UserEvent) => {
  const { getByRole } = renderResult;
  const signInForm = () => getByRole('form', { name: 'Sign In Form' });
  const usernameField = () => within(signInForm()).getByRole('textbox', { name: 'Username' });
  const passwordField = () => within(signInForm()).getByLabelText('Password');
  const submitButton = () => within(signInForm()).getByRole('button', { name: 'Submit' });
  const enterUsername = async (username: string) => user.type(usernameField(), username);
  const enterPassword = async (password: string) => user.type(passwordField(), password);
  const showPasswordButton = () => within(signInForm()).getByRole('button', { name: 'Show Password' });
  const hidePasswordButton = () => within(signInForm()).getByRole('button', { name: 'Hide Password' });
  const submitLogin = async (username: string, password: string) => {
    await enterUsername(username);
    await enterPassword(password);
    await user.click(submitButton());
  };
  return {
    enterUsername,
    enterPassword,
    submitLogin,
    usernameField,
    passwordField,
    submitButton,
    showPasswordButton,
    hidePasswordButton,
  };
};
