import { render, within, screen } from '@testing-library/react';
import { Auth } from 'aws-amplify';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';
import { act } from 'react-dom/test-utils';
import FootballOrganizer from './FootballOrganizer';
import loginForm from './auth/Login.test.helpers';
import mocked = jest.mocked;

jest.mock('aws-amplify');

const setLoggedInUser = (firstName = 'Foo', lastName = 'Bar') => {
  mocked(Auth).currentAuthenticatedUser.mockResolvedValue({
    attributes: {
      given_name: firstName,
      family_name: lastName,
    },
  });
};
const renderWithRouter = async (component: ReactElement, route = '/') => {
  window.history.pushState({}, 'Home', route);
  const user = userEvent.setup();
  await act(async () => {
    render(component, { wrapper: BrowserRouter });
  });
  return { user, ...loginForm(user) };
};
const banner = () => screen.getByRole('banner');
const menu = () => screen.getByRole('menu');
const heading = () => within(within(banner()).getByRole('heading')).getByRole('link');
const signInButton = () => within(banner()).getByRole('button', { name: 'Sign in' });
const signUpButton = () => within(banner()).getByRole('button', { name: 'Sign up' });
const accountMenuButton = () => within(banner()).getByRole('button', { name: 'Account' });
const signOutButton = () => within(menu()).getByRole('menuitem', { name: 'Sign out' });
const myAccountButton = () => within(menu()).getByRole('menuitem', { name: 'My account' });
const bannerButtonNames = () =>
  within(banner())
    .getAllByRole('button')
    .map((button) => button.textContent);

describe('football organizer', () => {
  beforeEach(() => {
    mocked(Auth).currentAuthenticatedUser.mockImplementation(() => new Promise(jest.fn()));
  });
  describe('app bar', () => {
    it('should have a title', async () => {
      await renderWithRouter(<FootballOrganizer />);

      expect(heading()).toHaveTextContent('Football Organizer');
    });
    it('should navigate to the homepage when the title is clicked', async () => {
      const { user } = await renderWithRouter(<FootballOrganizer />, '/login');

      await user.click(heading());

      expect(screen.queryByRole('form', { name: 'Sign In Form' })).toBeNull();
    });
    describe('not authenticated', () => {
      beforeEach(() => {
        mocked(Auth).currentAuthenticatedUser.mockRejectedValue({});
      });
      it('should have a sign in button', async () => {
        await renderWithRouter(<FootballOrganizer />);

        expect(signInButton()).toBeInTheDocument();
      });
      it('should have a sign up button', async () => {
        await renderWithRouter(<FootballOrganizer />);

        expect(signUpButton()).toBeInTheDocument();
      });
      it('should not have a profile button', async () => {
        await renderWithRouter(<FootballOrganizer />);

        expect(bannerButtonNames()).not.toContain('My profile');
      });
      it('should not have a sign out button', async () => {
        await renderWithRouter(<FootballOrganizer />);

        expect(bannerButtonNames()).not.toContain('Sign out');
      });
      describe('sign in', () => {
        it('should show the authenticated state', async () => {
          const { user, submitLogin } = await renderWithRouter(<FootballOrganizer />);
          mocked(Auth).signIn.mockResolvedValue({ attributes: { given_name: 'Foo', family_name: 'Bar' } });
          await user.click(signInButton());

          await submitLogin('Foo', 'Bar');

          expect(accountMenuButton()).toBeInTheDocument();
        });
      });
    });
    describe('authenticated', () => {
      beforeEach(async () => {
        setLoggedInUser();
      });
      it('should show the user initials in the account menu button', async () => {
        setLoggedInUser('David', 'Johnston');

        await renderWithRouter(<FootballOrganizer />);

        expect(accountMenuButton()).toHaveTextContent('DJ');
      });
      it('should have a Sign out button', async () => {
        const { user } = await renderWithRouter(<FootballOrganizer />);

        await user.click(accountMenuButton());

        expect(signOutButton()).toBeInTheDocument();
      });
      it('should have a My account button', async () => {
        const { user } = await renderWithRouter(<FootballOrganizer />);

        await user.click(accountMenuButton());

        expect(myAccountButton()).toBeInTheDocument();
      });
      it('should close the account menu when pressing escape', async () => {
        const { user } = await renderWithRouter(<FootballOrganizer />);
        await user.click(accountMenuButton());

        await user.keyboard('{Esc}');

        expect(screen.queryByRole('menu')).toBeNull();
      });
      it('should close the account menu when clicking on it', async () => {
        const { user } = await renderWithRouter(<FootballOrganizer />);
        await user.click(accountMenuButton());

        await user.click(screen.getByRole('presentation'));

        expect(screen.queryByRole('menu')).toBeNull();
      });
      it('should not have a sign in button', async () => {
        await renderWithRouter(<FootballOrganizer />);

        expect(bannerButtonNames()).not.toContain('Sign in');
      });
      it('should not have a sign up button', async () => {
        await renderWithRouter(<FootballOrganizer />);

        expect(bannerButtonNames()).not.toContain('Sign up');
      });
      describe('log out', () => {
        it('should return to the unauthenticated state', async () => {
          const { user } = await renderWithRouter(<FootballOrganizer />);
          mocked(Auth).signOut.mockResolvedValue({});

          await user.click(accountMenuButton());
          await user.click(signOutButton());

          expect(signInButton()).toBeInTheDocument();
        });
      });
    });
  });
  describe('router', () => {
    it('should redirect to the homepage when navigating to the sign in page and already authenticated', async () => {
      setLoggedInUser();

      await renderWithRouter(<FootballOrganizer />, '/login');

      expect(screen.queryByRole('form', { name: 'Sign In Form' })).toBeNull();
    });
    it('should show the sign up form when sign up is clicked', async () => {
      const { user } = await renderWithRouter(<FootballOrganizer />);

      await user.click(signUpButton());

      expect(screen.getByRole('form', { name: 'Sign Up Form' })).toBeInTheDocument();
    });
  });
});
