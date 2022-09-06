import { render, RenderResult, screen, within } from '@testing-library/react';
import amplify from 'aws-amplify';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';
import { act } from 'react-dom/test-utils';
import FootballOrganizer from './FootballOrganizer';
import loginForm from './auth/Login.test.helpers';

jest.mock('aws-amplify');

const renderWithRouter = async (component: ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Home', route);

  const user = userEvent.setup();
  let renderResult = {} as RenderResult;
  await act(async () => {
    renderResult = render(component, { wrapper: BrowserRouter });
  });
  const { getByRole } = renderResult;
  const banner = () => getByRole('banner');
  const heading = () => within(banner()).getByRole('heading');
  const signInButton = () => within(banner()).getByRole('button', { name: 'Sign in' });
  const signUpButton = () => within(banner()).getByRole('button', { name: 'Sign up' });
  const signOutButton = () => within(banner()).getByRole('button', { name: 'Sign out' });
  const myProfileButton = () => within(banner()).getByRole('button', { name: 'My Profile' });
  const bannerButtonNames = () =>
    within(banner())
      .getAllByRole('button')
      .map((button) => button.textContent);
  return { ...renderResult, user, heading, signInButton, signUpButton, signOutButton, myProfileButton, bannerButtonNames, ...loginForm(renderResult, user) };
};

describe('football organizer', () => {
  beforeEach(() => {
    amplify.Auth.currentAuthenticatedUser.mockImplementation(() => new Promise(jest.fn()));
  });
  describe('app bar', () => {
    it('should have a title', async () => {
      const { heading } = await renderWithRouter(<FootballOrganizer />);

      expect(heading()).toHaveTextContent('Football Organizer');
    });
    describe('not authenticated', () => {
      beforeEach(() => {
        amplify.Auth.currentAuthenticatedUser.mockRejectedValue();
      });
      it('should have a sign in button', async () => {
        const { signInButton } = await renderWithRouter(<FootballOrganizer />);

        expect(signInButton()).toBeInTheDocument();
      });
      it('should have a sign up button', async () => {
        const { signUpButton } = await renderWithRouter(<FootballOrganizer />);

        expect(signUpButton()).toBeInTheDocument();
      });
      it('should not have a profile button', async () => {
        const { bannerButtonNames } = await renderWithRouter(<FootballOrganizer />);

        expect(bannerButtonNames()).not.toContain('My profile');
      });
      it('should not have a sign out button', async () => {
        const { bannerButtonNames } = await renderWithRouter(<FootballOrganizer />);

        expect(bannerButtonNames()).not.toContain('Sign out');
      });
      describe('sign in', () => {
        it('should show the authenticated state', async () => {
          const { user, signInButton, signOutButton, submitLogin } = await renderWithRouter(<FootballOrganizer />);
          amplify.Auth.signIn.mockResolvedValue({});
          await user.click(signInButton());
          await submitLogin('Foo', 'Bar');

          expect(signOutButton()).toBeInTheDocument();
        });
      });
    });
    describe('authenticated', () => {
      beforeEach(async () => {
        amplify.Auth.currentAuthenticatedUser.mockResolvedValue({});
      });
      it('should have a profile button', async () => {
        const { myProfileButton } = await renderWithRouter(<FootballOrganizer />);

        expect(myProfileButton()).toBeInTheDocument();
      });
      it('should have a sign out button', async () => {
        const { signOutButton } = await renderWithRouter(<FootballOrganizer />);

        expect(signOutButton()).toBeInTheDocument();
      });
      it('should not have a sign in button', async () => {
        const { bannerButtonNames } = await renderWithRouter(<FootballOrganizer />);

        expect(bannerButtonNames()).not.toContain('Sign in');
      });
      it('should not have a sign up button', async () => {
        const { bannerButtonNames } = await renderWithRouter(<FootballOrganizer />);

        expect(bannerButtonNames()).not.toContain('Sign up');
      });
      describe('log out', () => {
        it('should return to the unauthenticated state', async () => {
          const { user, signOutButton, signInButton } = await renderWithRouter(<FootballOrganizer />);
          amplify.Auth.signOut.mockResolvedValue({});

          await user.click(signOutButton());

          expect(signInButton()).toBeInTheDocument();
        });
      });
    });
  });
  describe('router', () => {
    it('should redirect to the homepage when navigating to the sign in page and already authenticated', async () => {
      amplify.Auth.currentAuthenticatedUser.mockResolvedValue({});
      await renderWithRouter(<FootballOrganizer />);

      expect(screen.queryByRole('form', { name: 'Sign In Form' })).toBeNull();
    });
  });
});
