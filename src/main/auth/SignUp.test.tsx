import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from './SignUp';

const usernameField = () => screen.getByRole('textbox', { name: 'Username' });
const emailAddressField = () => screen.getByRole('textbox', { name: 'Email Address' });
const firstNameField = () => screen.getByRole('textbox', { name: 'First Name' });
const lastNameField = () => screen.getByRole('textbox', { name: 'Last Name' });
const passwordField = () => screen.getByLabelText('Password *');
const submitButton = () => screen.getByRole('button', { name: 'Submit' });

const fillInAllFields = async () => {
  await userEvent.type(firstNameField(), 'Joe');
  await userEvent.type(lastNameField(), 'Bloggs');
  await userEvent.type(usernameField(), 'jbloggs');
  await userEvent.type(emailAddressField(), 'joe.bloggs@email.com');
  await userEvent.type(passwordField(), 'SecretPassword');
};

describe('sign up', () => {
  it('should have a title of Sign Up', () => {
    render(<SignUp />);

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
  it('should have a username field', () => {
    render(<SignUp />);

    expect(usernameField()).toBeInTheDocument();
  });
  it('should have an email address field', () => {
    render(<SignUp />);

    expect(emailAddressField()).toBeInTheDocument();
  });
  it('should have a first name field', () => {
    render(<SignUp />);

    expect(firstNameField()).toBeInTheDocument();
  });
  it('should have a last name field', () => {
    render(<SignUp />);

    expect(lastNameField()).toBeInTheDocument();
  });
  it('should have a password field', () => {
    render(<SignUp />);

    expect(passwordField()).toBeInTheDocument();
  });
  it('should disable the submit button when no data has been entered', () => {
    render(<SignUp />);

    expect(submitButton()).toBeDisabled();
  });
  it('should enable the submit button when all fields are filled', async () => {
    render(<SignUp />);

    await fillInAllFields();

    expect(submitButton()).toBeEnabled();
  });
  it('should disable the submit button when the first name field is emptied', async () => {
    render(<SignUp />);
    await fillInAllFields();

    await userEvent.clear(firstNameField());

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when the last name field is emptied', async () => {
    render(<SignUp />);
    await fillInAllFields();

    await userEvent.clear(lastNameField());

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when the username field is emptied', async () => {
    render(<SignUp />);
    await fillInAllFields();

    await userEvent.clear(usernameField());

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when the email address field is emptied', async () => {
    render(<SignUp />);
    await fillInAllFields();

    await userEvent.clear(emailAddressField());

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when the password field is emptied', async () => {
    render(<SignUp />);
    await fillInAllFields();

    await userEvent.clear(passwordField());

    expect(submitButton()).toBeDisabled();
  });
});
