import { render, within, screen, act } from '@testing-library/react';
import amplify from 'aws-amplify';
import userEvent from '@testing-library/user-event';
import FootballOrganizer from './FootballOrganizer';

jest.mock('aws-amplify');

const withinBanner = () => within(screen.getByRole('banner'));
const bannerButtonNames = () =>
  withinBanner()
    .getAllByRole('button')
    .map((button) => button.textContent);
const withinSignInForm = () => within(screen.getByRole('form', { name: 'Sign In Form' }));

describe('football organizer', () => {
  beforeEach(() => {
    amplify.Auth.currentAuthenticatedUser.mockImplementation(() => new Promise(jest.fn()));
  });
  describe('app bar', () => {
    it('should have a title', async () => {
      await act(async () => {
        render(<FootballOrganizer />);
      });

      expect(withinBanner().getByRole('heading')).toHaveTextContent('Football Organizer');
    });
    describe('not authenticated', () => {
      beforeEach(async () => {
        amplify.Auth.currentAuthenticatedUser.mockRejectedValue();
        await act(async () => {
          render(<FootballOrganizer />);
        });
      });
      it('should have a sign in button', () => {
        expect(withinBanner().getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
      });
      it('should have a sign up button', () => {
        expect(withinBanner().getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
      });
      it('should not have a profile button', () => {
        expect(bannerButtonNames()).not.toContain('My profile');
      });
      it('should not have a sign out button', () => {
        expect(bannerButtonNames()).not.toContain('Sign out');
      });
      describe('sign in', () => {
        it('should show the authenticated state', async () => {
          amplify.Auth.signIn.mockResolvedValue({});
          await userEvent.click(withinBanner().getByRole('button', { name: 'Sign in' }));
          await userEvent.type(withinSignInForm().getByRole('textbox', { name: 'Username' }), 'Foo');
          await userEvent.type(withinSignInForm().getByLabelText('Password'), 'Bar');
          await userEvent.click(withinSignInForm().getByRole('button', { name: 'Submit' }));

          expect(withinBanner().getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
        });
      });
    });
    describe('authenticated', () => {
      beforeEach(async () => {
        amplify.Auth.currentAuthenticatedUser.mockResolvedValue({});
        await act(async () => {
          render(<FootballOrganizer />);
        });
      });
      it('should have a profile button', () => {
        expect(withinBanner().getByRole('button', { name: 'My Profile' })).toBeInTheDocument();
      });
      it('should have a sign out button', () => {
        expect(withinBanner().getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
      });
      it('should not have a sign in button', () => {
        expect(bannerButtonNames()).not.toContain('Sign in');
      });
      it('should not have a sign up button', () => {
        expect(bannerButtonNames()).not.toContain('Sign up');
      });
      describe('log out', () => {
        it('should return to the unauthenticated state', async () => {
          amplify.Auth.signOut.mockResolvedValue({});

          await userEvent.click(withinBanner().getByRole('button', { name: 'Sign out' }));

          expect(withinBanner().getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
        });
      });
    });
  });
});
