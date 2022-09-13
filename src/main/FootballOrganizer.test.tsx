import { render, screen, within } from '@testing-library/react';
import { Auth } from 'aws-amplify';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ReactElement } from 'react';
import FootballOrganizer from './FootballOrganizer';
import loginForm from './auth/Login.test.helpers';
import mocked = jest.mocked;

jest.mock('aws-amplify');

const banner = () => screen.getByRole('banner');
const menu = () => screen.getByRole('menu');
const heading = () => within(within(banner()).getByRole('heading')).getByRole('link');
const renderWithRouter = (component: ReactElement, route = '/') => {
  window.history.pushState({}, 'Home', route);
  const user = userEvent.setup();
  render(component, { wrapper: BrowserRouter });
  return { user, ...loginForm(user) };
};
const renderAuthenticated = async (component: ReactElement, options: { route?: string; firstName?: string; lastName?: string } = { route: '/', firstName: 'Foo', lastName: 'Bar' }) => {
  mocked(Auth).currentAuthenticatedUser.mockResolvedValue({
    attributes: {
      given_name: options.firstName,
      family_name: options.lastName,
    },
  });
  const utils = renderWithRouter(component, options.route);
  await screen.findByRole('button', { name: 'Account' });
  return utils;
};
const renderUnauthenticated = async (component: ReactElement, route = '/') => {
  mocked(Auth).currentAuthenticatedUser.mockRejectedValue('The user is not authenticated');
  const utils = renderWithRouter(component, route);
  await screen.findByRole('button', { name: 'Sign in' });
  return utils;
};

describe('football organizer', () => {
  beforeEach(() => {
    mocked(Auth).currentAuthenticatedUser.mockImplementation(() => new Promise(jest.fn()));
  });
  describe('app bar', () => {
    describe('title', () => {
      it('should have a title', () => {
        renderWithRouter(<FootballOrganizer />);

        expect(heading()).toHaveTextContent('Football Organizer');
      });
      it('should navigate to the homepage when the title is clicked', async () => {
        const { user } = renderWithRouter(<FootballOrganizer />, '/login');

        await user.click(heading());

        expect(screen.queryByRole('form', { name: 'Sign In Form' })).not.toBeInTheDocument();
      });
    });
    describe('not authenticated', () => {
      it('should not have a sign in button if the current user request never completes', () => {
        renderWithRouter(<FootballOrganizer />);

        expect(within(banner()).queryByRole('button', { name: 'Sign in' })).not.toBeInTheDocument();
      });
      it('should not have a sign up button if the current user request never completes', () => {
        renderWithRouter(<FootballOrganizer />);

        expect(within(banner()).queryByRole('button', { name: 'Sign up' })).not.toBeInTheDocument();
      });
      it('should have a sign in button', async () => {
        await renderUnauthenticated(<FootballOrganizer />);

        expect(within(banner()).getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
      });
      it('should have a sign up button', async () => {
        await renderUnauthenticated(<FootballOrganizer />);

        expect(within(banner()).getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
      });
      it('should not have an Account button', async () => {
        await renderUnauthenticated(<FootballOrganizer />);

        expect(within(banner()).queryByRole('button', { name: 'Account' })).not.toBeInTheDocument();
      });
      describe('sign in', () => {
        it('should show the authenticated state', async () => {
          const { user, submitLogin } = await renderUnauthenticated(<FootballOrganizer />);
          mocked(Auth).signIn.mockResolvedValue({ attributes: { given_name: 'Foo', family_name: 'Bar' } });
          await user.click(within(banner()).getByRole('button', { name: 'Sign in' }));

          await submitLogin('Foo', 'Bar');

          expect(within(banner()).getByRole('button', { name: 'Account' })).toBeInTheDocument();
        });
      });
    });
    describe('authenticated', () => {
      it('should show the user initials in the account menu button', async () => {
        await renderAuthenticated(<FootballOrganizer />, { firstName: 'David', lastName: 'Johnston' });

        expect(within(banner()).getByRole('button', { name: 'Account' })).toHaveTextContent('DJ');
      });
      it('should have a Sign out button', async () => {
        const { user } = await renderAuthenticated(<FootballOrganizer />);

        await user.click(within(banner()).getByRole('button', { name: 'Account' }));

        expect(within(menu()).getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();
      });
      it('should have a My account button', async () => {
        const { user } = await renderAuthenticated(<FootballOrganizer />);

        await user.click(within(banner()).getByRole('button', { name: 'Account' }));

        expect(within(menu()).getByRole('menuitem', { name: 'My account' })).toBeInTheDocument();
      });
      it('should close the account menu when pressing escape', async () => {
        const { user } = await renderAuthenticated(<FootballOrganizer />);
        await user.click(within(banner()).getByRole('button', { name: 'Account' }));

        await user.keyboard('{Esc}');

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
      it('should close the account menu when clicking on it', async () => {
        const { user } = await renderAuthenticated(<FootballOrganizer />);
        await user.click(within(banner()).getByRole('button', { name: 'Account' }));

        await user.click(screen.getByRole('presentation'));

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
      it('should not have a sign in button', async () => {
        await renderAuthenticated(<FootballOrganizer />);

        expect(within(banner()).queryByRole('button', { name: 'Sign in' })).not.toBeInTheDocument();
      });
      it('should not have a sign up button', async () => {
        await renderAuthenticated(<FootballOrganizer />);

        expect(within(banner()).queryByRole('button', { name: 'Sign up' })).not.toBeInTheDocument();
      });
      describe('log out', () => {
        it('should return to the unauthenticated state', async () => {
          const { user } = await renderAuthenticated(<FootballOrganizer />);
          mocked(Auth).signOut.mockResolvedValue({});

          await user.click(within(banner()).getByRole('button', { name: 'Account' }));
          await user.click(within(menu()).getByRole('menuitem', { name: 'Sign out' }));

          expect(within(banner()).getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
        });
      });
    });
  });
  describe('router', () => {
    it('should redirect to the homepage when navigating to the sign in page and already authenticated', async () => {
      await renderAuthenticated(<FootballOrganizer />, { route: '/login' });

      expect(screen.queryByRole('form', { name: 'Sign In Form' })).not.toBeInTheDocument();
    });
    it('should show the sign up form when sign up is clicked', async () => {
      const { user } = await renderUnauthenticated(<FootballOrganizer />);

      await user.click(within(banner()).getByRole('button', { name: 'Sign up' }));

      expect(screen.getByRole('form', { name: 'Sign Up Form' })).toBeInTheDocument();
    });
  });
});
