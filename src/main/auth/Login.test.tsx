import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Auth } from 'aws-amplify';
import loginForm from './Login.test.helpers';

import Login from './Login';
import mocked = jest.mocked;
import { User } from './User';

jest.mock('aws-amplify');

const renderLogin = (onLogin: (user: User) => void = jest.fn()) => {
  render(<Login onLogin={onLogin} />);
  const user = userEvent.setup();
  return { user, ...loginForm(user) };
};

describe('login form', () => {
  it('should call the auth login API on submit', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    const { submitLogin } = renderLogin();

    await submitLogin('MyUsername', 'MyPassword');

    expect(Auth.signIn).toHaveBeenCalledWith('MyUsername', 'MyPassword');
  });
  it('should invoke the onLogin callback on success', async () => {
    const onLogin = jest.fn();
    const loggedInUser = {} as User;
    mocked(Auth).signIn.mockResolvedValue(loggedInUser);
    const { submitLogin } = renderLogin(onLogin);

    await submitLogin('A', 'A');

    expect(onLogin).toHaveBeenCalledWith(loggedInUser);
  });
  it('should show password when clicking the reveal button', async () => {
    const { user, passwordField, enterPassword, showPasswordButton } = renderLogin();
    await enterPassword('HiddenPassword');

    await user.click(showPasswordButton());

    expect(passwordField()).toHaveAttribute('type', 'text');
  });
  it('should hide password when clicking the un-reveal button', async () => {
    const { user, enterPassword, showPasswordButton, hidePasswordButton, passwordField } = renderLogin();
    await enterPassword('HiddenPassword');
    await user.click(showPasswordButton());

    await user.click(hidePasswordButton());

    expect(passwordField()).toHaveAttribute('type', 'password');
  });
  it('should show the visibility icon when the password is hidden', () => {
    renderLogin();

    expect(screen.getByTestId('VisibilityIcon')).toBeInTheDocument();
  });
  it('should show the visibility off icon when the password is shown', async () => {
    const { user, showPasswordButton } = renderLogin();

    await user.click(showPasswordButton());

    expect(screen.getByTestId('VisibilityOffIcon')).toBeInTheDocument();
  });
  it('should show the failure message if login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { submitLogin } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByText('Login failed')).toBeInTheDocument();
  });
  it('should not show the login failed message by default', () => {
    renderLogin();

    expect(screen.queryByText('Login failed')).not.toBeInTheDocument();
  });
  it('should mark the username field as invalid if login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { submitLogin, usernameField } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(usernameField()).toHaveErrorMessage('Login failed');
  });
  it('should not mark the username field as invalid by default', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { usernameField } = renderLogin();

    expect(usernameField()).not.toHaveAttribute('aria-invalid', 'true');
    expect(usernameField()).not.toHaveAttribute('aria-errormessage');
  });
  it('should show the username field as valid again when it is subsequently modified', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { enterUsername, submitLogin, usernameField } = renderLogin();
    await submitLogin('Foo', 'Bar');

    await enterUsername('A');

    expect(usernameField()).not.toHaveAttribute('aria-invalid', 'true');
    expect(usernameField()).not.toHaveAttribute('aria-errormessage');
  });
  it('should hide the login failed message when the username field is subsequently edited', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { submitLogin, enterUsername } = renderLogin();
    await submitLogin('Foo', 'Bar');

    await enterUsername('A');

    expect(screen.queryByText('Login failed')).not.toBeInTheDocument();
  });
  it('should mark the password field as invalid if login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { submitLogin, passwordField } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(passwordField()).toHaveErrorMessage('Login failed');
  });
  it('should not mark the password field as invalid by default', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { passwordField } = renderLogin();

    expect(passwordField()).not.toHaveAttribute('aria-invalid', 'true');
    expect(passwordField()).not.toHaveAttribute('aria-errormessage');
  });
  it('should show the password field as valid again when it is subsequently modified', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { enterPassword, submitLogin, passwordField } = renderLogin();
    await submitLogin('Foo', 'Bar');

    await enterPassword('A');

    expect(passwordField()).not.toHaveAttribute('aria-invalid', 'true');
    expect(passwordField()).not.toHaveAttribute('aria-errormessage');
  });
  it('should hide the login failed message when the password field is subsequently edited', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { submitLogin, enterPassword } = renderLogin();
    await submitLogin('Foo', 'Bar');

    await enterPassword('A');

    expect(screen.queryByText('Login failed')).not.toBeInTheDocument();
  });
  it('should show a progress mask when login is in progress', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    const { submitLogin } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Login in progress')).toBeVisible();
  });
  it('should mark the sign in form as busy when login is in progress', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    const { submitLogin } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'true');
  });
  it('should hide the progress mask when login succeeds', async () => {
    mocked(Auth).signIn.mockResolvedValue({});
    const { submitLogin } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Login in progress')).not.toBeVisible();
  });
  it('should remove the busy marker from the sign in form when login succeeds', async () => {
    mocked(Auth).signIn.mockResolvedValue({});
    const { submitLogin } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'false');
  });
  it('should hide the progress mask when login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { submitLogin } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Login in progress')).not.toBeVisible();
  });
  it('should remove the busy marker from the sign in form when login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { submitLogin } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'false');
  });
  it('should disable the submit button when no password is entered', async () => {
    const { enterUsername, submitButton } = renderLogin();

    await enterUsername('MyUsername');

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when no username is entered', async () => {
    const { enterPassword, submitButton } = renderLogin();

    await enterPassword('MyPassword');

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when no values are entered', async () => {
    const { submitButton } = renderLogin();

    expect(submitButton()).toBeDisabled();
  });
});
