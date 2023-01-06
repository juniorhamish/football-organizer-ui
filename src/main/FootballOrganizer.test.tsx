import { render, within, screen, waitFor } from '@testing-library/react';
import { Auth } from 'aws-amplify';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';
import FootballOrganizer from './FootballOrganizer';
import { signInForm, submitLogin } from './auth/Login.test.helpers';
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
const banner = () => screen.getByRole('banner');
const menu = () => screen.getByRole('menu');
const heading = () => within(within(banner()).getByRole('heading')).getByRole('link');
const signInButton = () => within(banner()).getByRole('button', { name: 'Sign in' });
const signUpButton = () => within(banner()).getByRole('button', { name: 'Sign up' });
const accountMenuButton = () => within(banner()).findByRole('button', { name: 'Account' });
const signOutButton = () => within(menu()).getByRole('menuitem', { name: 'Sign out' });
const myAccountButton = () => within(menu()).getByRole('menuitem', { name: 'My account' });
const bannerButtonNames = () =>
  within(banner())
    .getAllByRole('button')
    .map((button) => button.textContent);

const renderWithRouter = (component: ReactElement, route = '/') => {
  window.history.pushState({}, 'Home', route);
  render(component, { wrapper: BrowserRouter });
};

describe('football organizer', () => {
  beforeEach(() => {
    mocked(Auth).currentAuthenticatedUser.mockImplementation(() => new Promise(jest.fn()));
  });
  describe('app bar', () => {
    it('should have a title', async () => {
      renderWithRouter(<FootballOrganizer />);

      expect(heading()).toHaveTextContent('Football Organizer');
    });
    it('should navigate to the homepage when the title is clicked', async () => {
      renderWithRouter(<FootballOrganizer />, '/login');

      await userEvent.click(heading());

      expect(screen.queryByRole('form', { name: 'Sign In Form' })).not.toBeInTheDocument();
    });
    describe('not authenticated', () => {
      beforeEach(() => {
        mocked(Auth).currentAuthenticatedUser.mockRejectedValue({});
      });
      it('should have a sign in button', async () => {
        renderWithRouter(<FootballOrganizer />);

        expect(signInButton()).toBeInTheDocument();
      });
      it('should have a sign up button', async () => {
        renderWithRouter(<FootballOrganizer />);

        expect(signUpButton()).toBeInTheDocument();
      });
      it('should not have a profile button', async () => {
        renderWithRouter(<FootballOrganizer />);

        expect(bannerButtonNames()).not.toContain('My profile');
      });
      it('should not have a sign out button', async () => {
        renderWithRouter(<FootballOrganizer />);

        expect(bannerButtonNames()).not.toContain('Sign out');
      });
      describe('sign in', () => {
        it('should show the authenticated state', async () => {
          renderWithRouter(<FootballOrganizer />);
          mocked(Auth).signIn.mockResolvedValue({ attributes: { given_name: 'Foo', family_name: 'Bar' } });
          await userEvent.click(signInButton());

          await submitLogin('Foo', 'Bar');

          expect(await accountMenuButton()).toBeInTheDocument();
        });
      });
    });
    describe('authenticated', () => {
      beforeEach(async () => {
        setLoggedInUser();
      });
      it('should show the user initials in the account menu button', async () => {
        setLoggedInUser('David', 'Johnston');

        renderWithRouter(<FootballOrganizer />);

        expect(await accountMenuButton()).toHaveTextContent('DJ');
      });
      it('should have a Sign out button', async () => {
        renderWithRouter(<FootballOrganizer />);

        await userEvent.click(await accountMenuButton());

        expect(signOutButton()).toBeInTheDocument();
      });
      it('should have a My account button', async () => {
        renderWithRouter(<FootballOrganizer />);

        await userEvent.click(await accountMenuButton());

        expect(myAccountButton()).toBeInTheDocument();
      });
      it('should close the account menu when pressing escape', async () => {
        renderWithRouter(<FootballOrganizer />);
        await userEvent.click(await accountMenuButton());

        await userEvent.keyboard('{Esc}');

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
      it('should close the account menu when clicking on it', async () => {
        renderWithRouter(<FootballOrganizer />);
        await userEvent.click(await accountMenuButton());

        await userEvent.click(screen.getByRole('presentation'));

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
      it('should not have a sign in button', async () => {
        renderWithRouter(<FootballOrganizer />);
        await accountMenuButton();

        expect(bannerButtonNames()).not.toContain('Sign in');
      });
      it('should not have a sign up button', async () => {
        renderWithRouter(<FootballOrganizer />);
        await accountMenuButton();

        expect(bannerButtonNames()).not.toContain('Sign up');
      });
      describe('log out', () => {
        it('should return to the unauthenticated state', async () => {
          renderWithRouter(<FootballOrganizer />);
          mocked(Auth).signOut.mockResolvedValue({});

          await userEvent.click(await accountMenuButton());
          await userEvent.click(signOutButton());

          expect(signInButton()).toBeInTheDocument();
        });
      });
    });
  });
  describe('router', () => {
    it('should redirect to the homepage when navigating to the sign in page and already authenticated', async () => {
      setLoggedInUser();

      renderWithRouter(<FootballOrganizer />, '/login');

      await waitFor(() => {
        expect(screen.queryByRole('form', { name: 'Sign In Form' })).not.toBeInTheDocument();
      });
    });
    it('should redirect to the homepage when navigating to the sign up page and already authenticated', async () => {
      setLoggedInUser();

      renderWithRouter(<FootballOrganizer />, '/signup');

      await waitFor(() => {
        expect(screen.queryByRole('form', { name: 'Sign Up Form' })).not.toBeInTheDocument();
      });
    });
    it('should show the sign in form when sign in is clicked', async () => {
      renderWithRouter(<FootballOrganizer />);

      await userEvent.click(signInButton());

      expect(signInForm()).toBeInTheDocument();
    });
    it('should show the sign up form when sign up is clicked', async () => {
      renderWithRouter(<FootballOrganizer />);

      await userEvent.click(signUpButton());

      expect(screen.getByRole('form', { name: 'Sign Up Form' })).toBeInTheDocument();
    });
  });
});
