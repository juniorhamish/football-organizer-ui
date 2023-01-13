import { Auth } from 'aws-amplify';
import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ConfirmSignUp from './ConfirmSignUp';
import mocked = jest.mocked;
import { codeField, confirmButton, confirmSignUp, confirmSignUpForm, resendCodeButton } from './ConfirmSignUp.test.helpers';

jest.mock('aws-amplify');

const renderWithRouter = (username = '', onConfirm = () => {}) => {
  render(
    <MemoryRouter initialEntries={[{ state: { username } }]}>
      <ConfirmSignUp onConfirm={onConfirm} />
    </MemoryRouter>
  );
};

describe('confirm sign up', () => {
  it('should have a title', () => {
    renderWithRouter();

    expect(within(confirmSignUpForm()).getByText('Confirm Sign Up')).toBeInTheDocument();
  });
  it('should have the confirm sign up instructions for username', () => {
    renderWithRouter('whitedevil');

    expect(within(confirmSignUpForm()).getByText('Enter the code that was sent to the email address you provided at registration for user whitedevil')).toBeInTheDocument();
  });
  it('should have a confirmation code field', () => {
    renderWithRouter();

    expect(codeField()).toBeInTheDocument();
  });
  it('should disable the confirm button when the code is empty', () => {
    renderWithRouter();

    expect(confirmButton()).toBeDisabled();
  });
  it('should enable the confirm button when the code is entered', async () => {
    renderWithRouter();

    await userEvent.type(codeField(), 'ABCD1234');

    expect(confirmButton()).toBeEnabled();
  });
  it('should invoke the Auth confirm signup on submit', async () => {
    mocked(Auth).confirmSignUp.mockImplementation(() => new Promise(jest.fn()));
    renderWithRouter('foobar');

    await confirmSignUp('ABCD1234');

    expect(Auth.confirmSignUp).toHaveBeenCalledWith('foobar', 'ABCD1234');
  });
  it('should invoke the onConfirm callback on success', async () => {
    mocked(Auth).confirmSignUp.mockResolvedValue('SUCCESS');
    const onConfirm = jest.fn();
    renderWithRouter('foobar', onConfirm);

    await confirmSignUp('ABCD1234');

    expect(onConfirm).toHaveBeenCalled();
  });
  it('should invoke the Auth resend confirmation code on button click', async () => {
    mocked(Auth).resendSignUp.mockImplementation(() => new Promise(jest.fn()));
    renderWithRouter('spakowsky');

    await userEvent.click(resendCodeButton());

    expect(Auth.resendSignUp).toHaveBeenCalledWith('spakowsky');
  });
});
