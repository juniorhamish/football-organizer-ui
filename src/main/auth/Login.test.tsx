import { render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup/setup';
import { CognitoUser, ICognitoUserData } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';

import Login from './Login';
import mocked = jest.mocked;

jest.mock('amazon-cognito-identity-js');
jest.mock('aws-amplify');

type LoginPage = RenderResult & {
  user: UserEvent;
};

const renderLogin = (onLogin: (user: CognitoUser) => void = jest.fn()) => {
  const renderResult = render(<Login onLogin={onLogin} />);
  const user = userEvent.setup();
  return { ...renderResult, user };
};
const submitLogin = async (loginPage: LoginPage, username: string, password: string) => {
  const { user, getByRole, getByLabelText } = loginPage;
  await user.type(getByRole('textbox', { name: 'Username' }), username);
  await user.type(getByLabelText('Password'), password);
  await user.click(getByRole('button', { name: 'Submit' }));
};

describe('login form', () => {
  it('should call the auth login API on submit', async () => {
    mocked(Auth).signIn.mockImplementation(() => new Promise(jest.fn()));
    const loginPage = renderLogin();

    await submitLogin(loginPage, 'MyUsername', 'MyPassword');

    expect(Auth.signIn).toHaveBeenCalledWith('MyUsername', 'MyPassword');
  });
  it('should invoke the onLogin callback on success', async () => {
    const onLogin = jest.fn();
    const loggedInUser = new CognitoUser({} as ICognitoUserData);
    mocked(Auth).signIn.mockResolvedValue(loggedInUser);
    const renderResult = renderLogin(onLogin);

    await submitLogin(renderResult, 'A', 'A');

    expect(onLogin).toHaveBeenCalledWith(loggedInUser);
  });
  it('should show password when clicking the reveal button', async () => {
    const loginPage = renderLogin();
    const { user, getByLabelText, getByRole } = loginPage;
    await user.type(getByLabelText('Password'), 'HiddenPassword');

    await user.click(getByRole('button', { name: 'Show Password' }));

    expect(getByLabelText('Password')).toHaveAttribute('type', 'text');
  });
  it('should hide password when clicking the un-reveal button', async () => {
    const loginPage = renderLogin();
    const { user, getByLabelText, getByRole } = loginPage;
    await user.type(getByLabelText('Password'), 'HiddenPassword');
    await user.click(getByRole('button', { name: 'Show Password' }));

    await user.click(getByRole('button', { name: 'Hide Password' }));

    expect(getByLabelText('Password')).toHaveAttribute('type', 'password');
  });
  it('should show the visibility icon when the password is hidden', () => {
    const loginPage = renderLogin();
    const { getByTestId } = loginPage;

    expect(getByTestId('VisibilityIcon')).toBeInTheDocument();
  });
  it('should show the visibility off icon when the password is shown', async () => {
    const loginPage = renderLogin();
    const { user, getByRole, getByTestId } = loginPage;

    await user.click(getByRole('button', { name: 'Show Password' }));

    expect(getByTestId('VisibilityOffIcon')).toBeInTheDocument();
  });
});
