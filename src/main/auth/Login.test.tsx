import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Auth } from 'aws-amplify';

import Login from './Login';
import mocked = jest.mocked;
import { User } from './User';
import { enterPassword, enterUsername, hidePasswordButton, passwordField, showPasswordButton, submitButton, submitLogin, usernameField } from './Login.test.helpers';

jest.mock('aws-amplify');

const renderLogin = (onLogin: (user: User) => void = jest.fn()) => {
  render(<Login onLogin={onLogin} />);
};

describe('login form', () => {
  it('should call the auth login API on submit', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    renderLogin();

    await submitLogin('MyUsername', 'MyPassword');

    expect(Auth.signIn).toHaveBeenCalledWith('MyUsername', 'MyPassword');
  });
  it('should invoke the onLogin callback on success', async () => {
    const onLogin = jest.fn();
    const loggedInUser = {} as User;
    mocked(Auth).signIn.mockResolvedValue(loggedInUser);
    renderLogin(onLogin);

    await submitLogin('A', 'A');

    expect(onLogin).toHaveBeenCalledWith(loggedInUser);
  });
  it('should show password when clicking the reveal button', async () => {
    renderLogin();
    await enterPassword('HiddenPassword');

    await userEvent.click(showPasswordButton());

    expect(passwordField()).toHaveAttribute('type', 'text');
  });
  it('should hide password when clicking the un-reveal button', async () => {
    renderLogin();
    await enterPassword('HiddenPassword');
    await userEvent.click(showPasswordButton());

    await userEvent.click(hidePasswordButton());

    expect(passwordField()).toHaveAttribute('type', 'password');
  });
  it('should show the visibility icon when the password is hidden', () => {
    renderLogin();

    expect(screen.getByTestId('VisibilityIcon')).toBeInTheDocument();
  });
  it('should show the visibility off icon when the password is shown', async () => {
    renderLogin();

    await userEvent.click(showPasswordButton());

    expect(screen.getByTestId('VisibilityOffIcon')).toBeInTheDocument();
  });
  it('should show the failure message if login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByText('Login failed')).toBeInTheDocument();
  });
  it('should not show the login failed message by default', () => {
    renderLogin();

    expect(screen.queryByText('Login failed')).not.toBeInTheDocument();
  });
  it('should mark the username field as invalid if login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(usernameField()).toHaveErrorMessage('Login failed');
  });
  it('should not mark the username field as invalid by default', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderLogin();

    expect(usernameField()).not.toHaveAttribute('aria-invalid', 'true');
    expect(usernameField()).not.toHaveAttribute('aria-errormessage');
  });
  it('should show the username field as valid again when it is subsequently modified', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderLogin();
    await submitLogin('Foo', 'Bar');

    await enterUsername('A');

    expect(usernameField()).not.toHaveAttribute('aria-invalid', 'true');
    expect(usernameField()).not.toHaveAttribute('aria-errormessage');
  });
  it('should hide the login failed message when the username field is subsequently edited', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderLogin();
    await submitLogin('Foo', 'Bar');

    await enterUsername('A');

    expect(screen.queryByText('Login failed')).not.toBeInTheDocument();
  });
  it('should mark the password field as invalid if login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(passwordField()).toHaveErrorMessage('Login failed');
  });
  it('should not mark the password field as invalid by default', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderLogin();

    expect(passwordField()).not.toHaveAttribute('aria-invalid', 'true');
    expect(passwordField()).not.toHaveAttribute('aria-errormessage');
  });
  it('should show the password field as valid again when it is subsequently modified', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderLogin();
    await submitLogin('Foo', 'Bar');

    await enterPassword('A');

    expect(passwordField()).not.toHaveAttribute('aria-invalid', 'true');
    expect(passwordField()).not.toHaveAttribute('aria-errormessage');
  });
  it('should hide the login failed message when the password field is subsequently edited', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderLogin();
    await submitLogin('Foo', 'Bar');

    await enterPassword('A');

    expect(screen.queryByText('Login failed')).not.toBeInTheDocument();
  });
  it('should show a progress mask when login is in progress', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Login in progress')).toBeVisible();
  });
  it('should mark the sign in form as busy when login is in progress', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'true');
  });
  it('should hide the progress mask when login succeeds', async () => {
    mocked(Auth).signIn.mockResolvedValue({});
    renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Login in progress')).not.toBeVisible();
  });
  it('should remove the busy marker from the sign in form when login succeeds', async () => {
    mocked(Auth).signIn.mockResolvedValue({});
    renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'false');
  });
  it('should hide the progress mask when login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Login in progress')).not.toBeVisible();
  });
  it('should remove the busy marker from the sign in form when login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(screen.getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'false');
  });
  it('should disable the submit button when no password is entered', async () => {
    renderLogin();

    await enterUsername('MyUsername');

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when no username is entered', async () => {
    renderLogin();

    await enterPassword('MyPassword');

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when no values are entered', async () => {
    renderLogin();

    expect(submitButton()).toBeDisabled();
  });
});
