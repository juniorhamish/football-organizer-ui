import { Auth } from 'aws-amplify';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import ConfirmSignUp from './ConfirmSignUp';
import mocked = jest.mocked;

jest.mock('aws-amplify');

const renderWithRouter = (component: ReactElement, username = '') => {
  render(<MemoryRouter initialEntries={[{ state: { username } }]}>{component}</MemoryRouter>);
};

const confirmSignUpForm = () => screen.getByRole('form', { name: 'Confirm Sign Up Form' });
const codeField = () => within(confirmSignUpForm()).getByRole('textbox', { name: 'Code' });
const confirmButton = () => within(confirmSignUpForm()).getByRole('button', { name: 'Confirm' });

describe('confirm sign up', () => {
  it('should have a title', () => {
    renderWithRouter(<ConfirmSignUp />);

    expect(within(confirmSignUpForm()).getByText('Confirm Sign Up')).toBeInTheDocument();
  });
  it('should have the confirm sign up instructions', () => {
    renderWithRouter(<ConfirmSignUp />);

    expect(within(confirmSignUpForm()).getByText('Enter the code that was sent to the email address you provided at registration')).toBeInTheDocument();
  });
  it('should have a confirmation code field', () => {
    renderWithRouter(<ConfirmSignUp />);

    expect(codeField()).toBeInTheDocument();
  });
  it('should disable the confirm button when the code is empty', () => {
    renderWithRouter(<ConfirmSignUp />);

    expect(confirmButton()).toBeDisabled();
  });
  it('should enable the confirm button when the code is entered', async () => {
    renderWithRouter(<ConfirmSignUp />);

    await userEvent.type(codeField(), 'ABCD1234');

    expect(confirmButton()).toBeEnabled();
  });
  it('should invoke the Auth confirm signup on submit', async () => {
    mocked(Auth).confirmSignUp.mockImplementation(() => new Promise(jest.fn()));
    renderWithRouter(<ConfirmSignUp />, 'foobar');

    await userEvent.type(codeField(), 'ABCD1234');
    await userEvent.click(confirmButton());

    expect(Auth.confirmSignUp).toHaveBeenCalledWith('foobar', 'ABCD1234');
  });
});
