import { render, screen } from '@testing-library/react';
import SignUp from './SignUp';

const usernameField = () => screen.getByRole('textbox', { name: 'Username' });
const emailAddressField = () => screen.getByRole('textbox', { name: 'Email Address' });
const firstNameField = () => screen.getByRole('textbox', { name: 'First Name' });
const lastNameField = () => screen.getByRole('textbox', { name: 'Last Name' });
const passwordField = () => screen.getByLabelText('Password *');

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
});
