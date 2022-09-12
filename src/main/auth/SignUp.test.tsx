import { render } from '@testing-library/react';
import SignUp from './SignUp';

const renderSignUp = () => {
  const renderResult = render(<SignUp />);
  const { getByRole, getByLabelText } = renderResult;
  const usernameField = () => getByRole('textbox', { name: 'Username' });
  const emailAddressField = () => getByRole('textbox', { name: 'Email Address' });
  const firstNameField = () => getByRole('textbox', { name: 'First Name' });
  const lastNameField = () => getByRole('textbox', { name: 'Last Name' });
  const passwordField = () => getByLabelText('Password *');
  return { ...renderResult, usernameField, emailAddressField, firstNameField, lastNameField, passwordField };
};

describe('sign up', () => {
  it('should have a title of Sign Up', () => {
    const { getByText } = renderSignUp();

    expect(getByText('Sign Up')).toBeInTheDocument();
  });
  it('should have a username field', () => {
    const { usernameField } = renderSignUp();

    expect(usernameField()).toBeInTheDocument();
  });
  it('should have an email address field', () => {
    const { emailAddressField } = renderSignUp();

    expect(emailAddressField()).toBeInTheDocument();
  });
  it('should have a first name field', () => {
    const { firstNameField } = renderSignUp();

    expect(firstNameField()).toBeInTheDocument();
  });
  it('should have a last name field', () => {
    const { lastNameField } = renderSignUp();

    expect(lastNameField()).toBeInTheDocument();
  });
  it('should have a password field', () => {
    const { passwordField } = renderSignUp();

    expect(passwordField()).toBeInTheDocument();
  });
});
