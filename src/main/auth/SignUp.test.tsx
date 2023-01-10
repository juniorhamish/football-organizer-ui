import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Auth } from 'aws-amplify';
import { ISignUpResult } from 'amazon-cognito-identity-js';
import SignUp from './SignUp';
import mocked = jest.mocked;

jest.mock('aws-amplify');

const usernameField = () => screen.getByRole('textbox', { name: 'Username' });
const emailAddressField = () => screen.getByRole('textbox', { name: 'Email Address' });
const firstNameField = () => screen.getByRole('textbox', { name: 'First Name' });
const lastNameField = () => screen.getByRole('textbox', { name: 'Last Name' });
const passwordField = () => screen.getByLabelText('Password *');
const submitButton = () => screen.getByRole('button', { name: 'Submit' });

const fillInAllFields = async ({ firstName = 'Joe', lastName = 'Bloggs', username = 'jbloggs', emailAddress = 'jbloggs@email.com', password = 'SecretPassword' } = {}) => {
  await userEvent.type(firstNameField(), firstName);
  await userEvent.type(lastNameField(), lastName);
  await userEvent.type(usernameField(), username);
  await userEvent.type(emailAddressField(), emailAddress);
  await userEvent.type(passwordField(), password);
};

const renderSignUp = (onSignUp = () => {}) => render(<SignUp onSignUp={onSignUp} />);

describe('sign up', () => {
  it('should have a title of Sign Up', () => {
    renderSignUp();

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
  it('should have a username field', () => {
    renderSignUp();

    expect(usernameField()).toBeInTheDocument();
  });
  it('should have an email address field', () => {
    renderSignUp();

    expect(emailAddressField()).toBeInTheDocument();
  });
  it('should have a first name field', () => {
    renderSignUp();

    expect(firstNameField()).toBeInTheDocument();
  });
  it('should have a last name field', () => {
    renderSignUp();

    expect(lastNameField()).toBeInTheDocument();
  });
  it('should have a password field', () => {
    renderSignUp();

    expect(passwordField()).toBeInTheDocument();
  });
  it('should disable the submit button when no data has been entered', () => {
    renderSignUp();

    expect(submitButton()).toBeDisabled();
  });
  it('should enable the submit button when all fields are filled', async () => {
    renderSignUp();

    await fillInAllFields();

    expect(submitButton()).toBeEnabled();
  });
  it('should disable the submit button when the first name field is emptied', async () => {
    renderSignUp();
    await fillInAllFields();

    await userEvent.clear(firstNameField());

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when the last name field is emptied', async () => {
    renderSignUp();
    await fillInAllFields();

    await userEvent.clear(lastNameField());

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when the username field is emptied', async () => {
    renderSignUp();
    await fillInAllFields();

    await userEvent.clear(usernameField());

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when the email address field is emptied', async () => {
    renderSignUp();
    await fillInAllFields();

    await userEvent.clear(emailAddressField());

    expect(submitButton()).toBeDisabled();
  });
  it('should disable the submit button when the password field is emptied', async () => {
    renderSignUp();
    await fillInAllFields();

    await userEvent.clear(passwordField());

    expect(submitButton()).toBeDisabled();
  });
  it('should make sign up API call', async () => {
    mocked(Auth).signUp.mockImplementation(() => new Promise(jest.fn()));
    renderSignUp();
    await fillInAllFields({
      firstName: 'David',
      lastName: 'Johnston',
      username: 'djohnston',
      emailAddress: 'djohnston@email.com',
      password: 'P@ssword1234',
    });

    await userEvent.click(submitButton());

    expect(Auth.signUp).toHaveBeenCalledWith({
      username: 'djohnston',
      password: 'P@ssword1234',
      attributes: {
        email: 'djohnston@email.com',
        given_name: 'David',
        family_name: 'Johnston',
      },
    });
  });
  it('should call the onSignUp callback when sign up succeeds', async () => {
    mocked(Auth).signUp.mockResolvedValue({} as ISignUpResult);
    const onSignUp = jest.fn();
    renderSignUp(onSignUp);
    await fillInAllFields({
      firstName: 'David',
      lastName: 'Johnston',
      username: 'djohnston',
      emailAddress: 'djohnston@email.com',
      password: 'P@ssword1234',
    });

    await userEvent.click(submitButton());

    expect(onSignUp).toHaveBeenCalledWith('djohnston');
  });
  it('should not call the onSignUp callback when sign up fails', async () => {
    mocked(Auth).signUp.mockRejectedValue({});
    const onSignUp = jest.fn();
    renderSignUp(onSignUp);
    await fillInAllFields({
      firstName: 'David',
      lastName: 'Johnston',
      username: 'djohnston',
      emailAddress: 'djohnston@email.com',
      password: 'P@ssword1234',
    });

    await userEvent.click(submitButton());

    expect(onSignUp).not.toHaveBeenCalled();
  });
});
