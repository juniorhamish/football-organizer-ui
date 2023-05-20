import { Auth } from 'aws-amplify';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ConfirmSignUp from './ConfirmSignUp';
import mocked = jest.mocked;
import { codeField, confirmButton, confirmSignUp, confirmSignupFailedError, confirmSignUpForm, resendCodeButton } from './ConfirmSignUp.test.helpers';

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
  it('should not invoke the onConfirm callback on failure', async () => {
    mocked(Auth).confirmSignUp.mockRejectedValue({});
    const onConfirm = jest.fn();
    renderWithRouter('foobar', onConfirm);

    await confirmSignUp('ABCD1234');

    expect(onConfirm).not.toHaveBeenCalled();
  });
  it('should mark the code field as invalid if confirm signup fails', async () => {
    mocked(Auth).confirmSignUp.mockRejectedValue(confirmSignupFailedError());
    renderWithRouter();

    await confirmSignUp('ABCD1234');

    expect(codeField()).toHaveErrorMessage('Invalid code');
  });
  it('should show the code field as valid again if it is subsequently modified', async () => {
    mocked(Auth).confirmSignUp.mockRejectedValue(confirmSignupFailedError());
    renderWithRouter();
    await confirmSignUp('ABCD1234');

    await userEvent.type(codeField(), 'XYZ');

    expect(codeField()).not.toHaveErrorMessage();
  });
  it('should invoke the Auth resend confirmation code on button click', async () => {
    mocked(Auth).resendSignUp.mockImplementation(() => new Promise(jest.fn()));
    renderWithRouter('spakowsky');

    await userEvent.click(resendCodeButton());

    expect(Auth.resendSignUp).toHaveBeenCalledWith('spakowsky');
  });
  describe('progress indicator', () => {
    describe('confirm', () => {
      it('should show a progress mask when confirm sign up is in progress', async () => {
        mocked(Auth).confirmSignUp.mockImplementation(() => new Promise(jest.fn()));
        renderWithRouter();

        await confirmSignUp('ABCD');

        expect(screen.getByLabelText('Confirm sign up in progress')).toBeVisible();
      });
      it('should mark the confirm sign up form as busy when confirm sign up is in progress', async () => {
        mocked(Auth).confirmSignUp.mockImplementation(() => new Promise(jest.fn()));
        renderWithRouter();

        await confirmSignUp('ABCD');

        expect(screen.getByLabelText('Confirm Sign Up Form')).toHaveAttribute('aria-busy', 'true');
      });
      it('should hide the progress mask when sign up succeeds', async () => {
        mocked(Auth).confirmSignUp.mockResolvedValue({});
        renderWithRouter();

        await confirmSignUp('ABCD');

        expect(screen.getByLabelText('Confirm sign up in progress')).not.toBeVisible();
      });
      it('should remove the busy marker from the confirm sign up form when confirm sign up succeeds', async () => {
        mocked(Auth).confirmSignUp.mockResolvedValue({});
        renderWithRouter();

        await confirmSignUp('ABCD');

        expect(screen.getByLabelText('Confirm Sign Up Form')).toHaveAttribute('aria-busy', 'false');
      });
      it('should hide the progress mask when confirm sign up fails', async () => {
        mocked(Auth).confirmSignUp.mockRejectedValue({});
        renderWithRouter();

        await confirmSignUp('ABCD');

        expect(screen.getByLabelText('Confirm sign up in progress')).not.toBeVisible();
      });
      it('should remove the busy marker from the confirm sign up form when confirm sign up fails', async () => {
        mocked(Auth).confirmSignUp.mockRejectedValue({});
        renderWithRouter();

        await confirmSignUp('ABCD');

        expect(screen.getByLabelText('Confirm Sign Up Form')).toHaveAttribute('aria-busy', 'false');
      });
    });
    describe('resend code', () => {
      it('should show a progress mask when resend code is in progress', async () => {
        mocked(Auth).resendSignUp.mockImplementation(() => new Promise(jest.fn()));
        renderWithRouter();

        await userEvent.click(resendCodeButton());

        expect(screen.getByLabelText('Resend confirmation code request in progress')).toBeVisible();
      });
      it('should mark the confirm sign up form as busy when resend code is in progress', async () => {
        mocked(Auth).resendSignUp.mockImplementation(() => new Promise(jest.fn()));
        renderWithRouter();

        await userEvent.click(resendCodeButton());

        expect(screen.getByLabelText('Confirm Sign Up Form')).toHaveAttribute('aria-busy', 'true');
      });
      it('should hide the progress mask when resend code succeeds', async () => {
        mocked(Auth).resendSignUp.mockResolvedValue({});
        renderWithRouter();

        await userEvent.click(resendCodeButton());

        expect(screen.getByLabelText('Resend confirmation code request in progress')).not.toBeVisible();
      });
      it('should remove the busy marker from the confirm sign up form when resend code succeeds', async () => {
        mocked(Auth).resendSignUp.mockResolvedValue({});
        renderWithRouter();

        await userEvent.click(resendCodeButton());

        expect(screen.getByLabelText('Confirm Sign Up Form')).toHaveAttribute('aria-busy', 'false');
      });
      it('should hide the progress mask when resend code fails', async () => {
        mocked(Auth).resendSignUp.mockRejectedValue({});
        renderWithRouter();

        await userEvent.click(resendCodeButton());

        expect(screen.getByLabelText('Resend confirmation code request in progress')).not.toBeVisible();
      });
      it('should remove the busy marker from the confirm sign up form when resend code fails', async () => {
        mocked(Auth).resendSignUp.mockRejectedValue({});
        renderWithRouter();

        await userEvent.click(resendCodeButton());

        expect(screen.getByLabelText('Confirm Sign Up Form')).toHaveAttribute('aria-busy', 'false');
      });
    });
  });
});
