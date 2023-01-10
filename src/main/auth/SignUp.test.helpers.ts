import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const signUpForm = () => screen.getByRole('form', { name: 'Sign Up Form' });
export const usernameField = () => within(signUpForm()).getByRole('textbox', { name: 'Username' });
export const emailAddressField = () => within(signUpForm()).getByRole('textbox', { name: 'Email Address' });
export const firstNameField = () => within(signUpForm()).getByRole('textbox', { name: 'First Name' });
export const lastNameField = () => within(signUpForm()).getByRole('textbox', { name: 'Last Name' });
export const passwordField = () => within(signUpForm()).getByLabelText('Password *');
export const submitButton = () => within(signUpForm()).getByRole('button', { name: 'Submit' });
export const fillInAllFields = async ({ firstName = 'Joe', lastName = 'Bloggs', username = 'jbloggs', emailAddress = 'jbloggs@email.com', password = 'SecretPassword' } = {}) => {
  await userEvent.type(firstNameField(), firstName);
  await userEvent.type(lastNameField(), lastName);
  await userEvent.type(usernameField(), username);
  await userEvent.type(emailAddressField(), emailAddress);
  await userEvent.type(passwordField(), password);
};
export const submitSignUp = async ({ firstName = 'Joe', lastName = 'Bloggs', username = 'jbloggs', emailAddress = 'jbloggs@email.com', password = 'SecretPassword' } = {}) => {
  await fillInAllFields({ firstName, lastName, username, emailAddress, password });
  await userEvent.click(submitButton());
};
