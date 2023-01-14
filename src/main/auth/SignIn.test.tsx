import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Auth } from 'aws-amplify';

import SignIn from './SignIn';
import mocked = jest.mocked;
import { User } from './User';
import {
  enterPassword,
  enterUsername,
  hidePasswordButton,
  signInFailedError,
  passwordField,
  showPasswordButton,
  submitButton,
  submitSignIn,
  userDoesNotExistError,
  usernameField,
  userNotConfirmedError,
} from './SignIn.test.helpers';

jest.mock('aws-amplify');

const renderSignIn = (onSignIn: (user: User) => void = jest.fn(), userNotConfirmed: () => void = jest.fn()) => {
  render(<SignIn onSignIn={onSignIn} userNotConfirmed={userNotConfirmed} />);
};

describe('Sign In form', () => {
  it('should call the auth signIn API on submit', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    renderSignIn();

    await submitSignIn('MyUsername', 'MyPassword');

    expect(Auth.signIn).toHaveBeenCalledWith('MyUsername', 'MyPassword');
  });
  it('should invoke the onSignIn callback on success', async () => {
    const onSignIn = jest.fn();
    const loggedInUser = {} as User;
    mocked(Auth).signIn.mockResolvedValue(loggedInUser);
    renderSignIn(onSignIn);

    await submitSignIn('A', 'A');

    expect(onSignIn).toHaveBeenCalledWith(loggedInUser);
  });
  it('should show password when clicking the reveal button', async () => {
    renderSignIn();
    await enterPassword('HiddenPassword');

    await userEvent.click(showPasswordButton());

    expect(passwordField()).toHaveAttribute('type', 'text');
  });
  it('should hide password when clicking the un-reveal button', async () => {
    renderSignIn();
    await enterPassword('HiddenPassword');
    await userEvent.click(showPasswordButton());

    await userEvent.click(hidePasswordButton());

    expect(passwordField()).toHaveAttribute('type', 'password');
  });
  it('should show the visibility icon when the password is hidden', () => {
    renderSignIn();

    expect(screen.getByTestId('VisibilityIcon')).toBeInTheDocument();
  });
  it('should show the visibility off icon when the password is shown', async () => {
    renderSignIn();

    await userEvent.click(showPasswordButton());

    expect(screen.getByTestId('VisibilityOffIcon')).toBeInTheDocument();
  });
  it('should show the user does not exist message when sign in fails', async () => {
    mocked(Auth).signIn.mockRejectedValue(userDoesNotExistError());
    renderSignIn();

    await submitSignIn('John', 'Hobbs');

    expect(usernameField()).toHaveErrorMessage('User does not exist');
  });
  it('should not show the user does not exist message by default', () => {
    renderSignIn();

    expect(usernameField()).not.toHaveErrorMessage();
  });
  it('should show the username field as valid again when it is subsequently modified', async () => {
    mocked(Auth).signIn.mockRejectedValue(userDoesNotExistError());
    renderSignIn();
    await submitSignIn('Foo', 'Bar');

    await enterUsername('A');

    expect(usernameField()).not.toHaveErrorMessage();
  });
  it('should hide the user does not exist message when the username field is subsequently edited', async () => {
    mocked(Auth).signIn.mockRejectedValue(userDoesNotExistError());
    renderSignIn();
    await submitSignIn('Foo', 'Bar');

    await enterUsername('A');

    expect(usernameField()).not.toHaveErrorMessage();
  });
  it('should mark the password field as invalid if sign in fails', async () => {
    mocked(Auth).signIn.mockRejectedValue(signInFailedError());
    renderSignIn();

    await submitSignIn('Foo', 'Bar');

    expect(passwordField()).toHaveErrorMessage('Sign in failed');
  });
  it('should not mark the password field as invalid by default', async () => {
    renderSignIn();

    expect(passwordField()).not.toHaveErrorMessage();
  });
  it('should show the password field as valid again when it is subsequently modified', async () => {
    mocked(Auth).signIn.mockRejectedValue(signInFailedError());
    renderSignIn();
    await submitSignIn('Foo', 'Bar');

    await enterPassword('A');

    expect(passwordField()).not.toHaveErrorMessage();
  });
  it('should mark the password field as invalid for generic sign in failures', async () => {
    mocked(Auth).signIn.mockRejectedValue(new Error());
    renderSignIn();

    await submitSignIn('Foo', 'Bar');

    expect(passwordField()).toHaveErrorMessage('Sign in failed');
  });
  it('should show a progress mask when sign in is in progress', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    renderSignIn();

    await submitSignIn('Foo', 'Bar');

    expect(screen.getByLabelText('Sign in in progress')).toBeVisible();
  });
  it('should mark the sign in form as busy when sign in is in progress', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    renderSignIn();

    await submitSignIn('Foo', 'Bar');

    expect(screen.getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'true');
  });
  it('should hide the progress mask when sign in succeeds', async () => {
    mocked(Auth).signIn.mockResolvedValue({});
    renderSignIn();

    await submitSignIn('Foo', 'Bar');

    expect(screen.getByLabelText('Sign in in progress')).not.toBeVisible();
  });
  it('should remove the busy marker from the sign in form when sign in succeeds', async () => {
    mocked(Auth).signIn.mockResolvedValue({});
    renderSignIn();

    await submitSignIn('Foo', 'Bar');

    expect(screen.getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'false');
  });
  it('should hide the progress mask when sign in fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderSignIn();

    await submitSignIn('Foo', 'Bar');

    expect(screen.getByLabelText('Sign in in progress')).not.toBeVisible();
  });
  it('should remove the busy marker from the sign in form when sign in fails', async () => {
    mocked(Auth).signIn.mockRejectedValue({});
    renderSignIn();

    await submitSignIn('Foo', 'Bar');

    expect(screen.getByLabelText('Sign In Form')).toHaveAttribute('aria-busy', 'false');
  });
  it('should disable the submit button when no password is entered', async () => {
    renderSignIn();

    await enterUsername('MyUsername');

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when no username is entered', async () => {
    renderSignIn();

    await enterPassword('MyPassword');

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when no values are entered', async () => {
    renderSignIn();

    expect(submitButton()).toBeDisabled();
  });
  it('should call the user not confirmed callback', async () => {
    const userNotConfirmed = jest.fn();
    mocked(Auth).signIn.mockRejectedValue(userNotConfirmedError());
    renderSignIn(jest.fn(), userNotConfirmed);

    await submitSignIn('eindhorn', 'finkel');

    expect(userNotConfirmed).toHaveBeenCalledWith('eindhorn');
  });
});
