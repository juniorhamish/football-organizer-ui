import { AppBar, Avatar, Button, IconButton, Link, ListItemIcon, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Auth, Hub } from 'aws-amplify';
import { Link as RouterLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';
import Login from './auth/Login';
import { User } from './auth/User';
import UserAvatar from './components/UserAvatar';
import SignUp from './auth/SignUp';
import ConfirmSignUp from './auth/ConfirmSignUp';

export default function FootballOrganizer() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User>();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuAnchor = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    (async () => {
      try {
        setCurrentUser(await Auth.currentAuthenticatedUser());
      } catch (e) {
        setCurrentUser(undefined);
      }
      return Hub.listen('auth', ({ payload }) => {
        const { event } = payload;
        if (event === 'autoSignIn') {
          setCurrentUser(payload.data);
        }
      });
    })();
  }, [setCurrentUser]);

  const logOut = useCallback(() => {
    Auth.signOut().then(() => {
      setCurrentUser(undefined);
    });
  }, [setCurrentUser]);

  const onLogin = useCallback(
    (user: User) => {
      setCurrentUser(user);
      navigate('/', { replace: true });
    },
    [navigate, setCurrentUser]
  );
  const onSignup = useCallback(
    (username: string) => {
      navigate('/confirm', { replace: true, state: { username } });
    },
    [navigate]
  );
  const onConfirm = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);
  const openAccountMenu = useCallback(() => setAccountMenuOpen(true), []);
  const closeAccountMenu = useCallback(() => setAccountMenuOpen(false), []);

  return (
    <div>
      <AppBar position="sticky" sx={{ marginBottom: '50px' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link component={RouterLink} color="secondary" underline="hover" to="/">
              Football Organizer
            </Link>
          </Typography>
          {!currentUser && (
            <Link component={RouterLink} to="/login">
              <Button color="secondary">Sign in</Button>
            </Link>
          )}
          {!currentUser && (
            <Link component={RouterLink} to="/signup">
              <Button color="secondary">Sign up</Button>
            </Link>
          )}
          {currentUser && (
            <Tooltip title="Account">
              <IconButton
                ref={accountMenuAnchor}
                onClick={openAccountMenu}
                aria-haspopup="true"
                aria-controls={accountMenuOpen ? 'account-menu' : undefined}
                aria-expanded={accountMenuOpen ? 'true' : undefined}
              >
                <UserAvatar name={`${currentUser.attributes.given_name} ${currentUser.attributes.family_name}`} />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <Menu
          id="account-menu"
          open={accountMenuOpen}
          anchorEl={accountMenuAnchor.current}
          onClose={closeAccountMenu}
          onClick={closeAccountMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <Avatar />
            My account
          </MenuItem>
          <MenuItem onClick={logOut}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </AppBar>
      <Routes>
        <Route path="/" element={<div>Homepage</div>} />
        <Route path="/login" element={!currentUser ? <Login onLogin={onLogin} /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!currentUser ? <SignUp onSignUp={onSignup} /> : <Navigate to="/" replace />} />
        <Route path="/confirm" element={state && state.username ? <ConfirmSignUp onConfirm={onConfirm} /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
