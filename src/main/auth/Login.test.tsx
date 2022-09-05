import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CognitoUser, ICognitoUserData } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';

import Login from './Login';
import mocked = jest.mocked;

jest.mock('amazon-cognito-identity-js');
jest.mock('aws-amplify');

const renderLogin = (onLogin: (user: CognitoUser) => void = jest.fn()) => {
  const renderResult = render(<Login onLogin={onLogin} />);
  const { getByLabelText, getByRole } = renderResult;
  const user = userEvent.setup();
  const usernameField = () => getByRole('textbox', { name: 'Username' });
  const passwordField = () => getByLabelText('Password');
  const enterUsername = async (username: string) => user.type(usernameField(), username);
  const enterPassword = async (password: string) => user.type(passwordField(), password);
  const showPasswordButton = () => getByRole('button', { name: 'Show Password' });
  const hidePasswordButton = () => getByRole('button', { name: 'Hide Password' });
  const submitLogin = async (username: string, password: string) => {
    await enterUsername(username);
    await enterPassword(password);
    await user.click(getByRole('button', { name: 'Submit' }));
  };
  return {
    ...renderResult,
    user,
    enterUsername,
    enterPassword,
    submitLogin,
    usernameField,
    passwordField,
    showPasswordButton,
    hidePasswordButton,
  };
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
    const loggedInUser = new CognitoUser({} as ICognitoUserData);
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
    const { getByTestId } = renderLogin();

    expect(getByTestId('VisibilityIcon')).toBeInTheDocument();
  });
  it('should show the visibility off icon when the password is shown', async () => {
    const { user, getByTestId, showPasswordButton } = renderLogin();

    await user.click(showPasswordButton());

    expect(getByTestId('VisibilityOffIcon')).toBeInTheDocument();
  });
  it('should show the failure message if login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { getByText, submitLogin } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(getByText('Login failed')).toBeInTheDocument();
  });
  it('should not show the login failed message by default', () => {
    const { queryByText } = renderLogin();

    expect(queryByText('Login failed')).toBeNull();
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
    const { queryByText, submitLogin, enterUsername } = renderLogin();
    await submitLogin('Foo', 'Bar');

    await enterUsername('A');

    expect(queryByText('Login failed')).toBeNull();
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
    const { queryByText, submitLogin, enterPassword } = renderLogin();
    await submitLogin('Foo', 'Bar');

    await enterPassword('A');

    expect(queryByText('Login failed')).toBeNull();
  });
  it('should show a progress mask when login is in progress', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    const { submitLogin, getByLabelText } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(getByLabelText('Login in progress')).toBeVisible();
  });
  it('should mark the sign in form as busy when login is in progress', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    const { submitLogin, getByLabelText } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'true');
  });
  it('should hide the progress mask when login succeeds', async () => {
    mocked(Auth).signIn.mockResolvedValue({});
    const { submitLogin, getByLabelText } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(getByLabelText('Login in progress')).not.toBeVisible();
  });
  it('should remove the busy marker from the sign in form when login succeeds', async () => {
    mocked(Auth).signIn.mockResolvedValue({});
    const { submitLogin, getByLabelText } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'false');
  });
  it('should hide the progress mask when login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { submitLogin, getByLabelText } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(getByLabelText('Login in progress')).not.toBeVisible();
  });
  it('should remove the busy marker from the sign in form when login fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    const { submitLogin, getByLabelText } = renderLogin();

    await submitLogin('Foo', 'Bar');

    expect(getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'false');
  });
});
