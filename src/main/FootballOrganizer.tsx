import { AppBar, Avatar, Button, IconButton, Link, ListItemIcon, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Auth } from 'aws-amplify';
import { Link as RouterLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Logout } from '@mui/icons-material';
import Login from './auth/Login';
import { User } from './auth/User';

export default function FootballOrganizer() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User>();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuAnchor = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => setCurrentUser(user))
      .catch(() => setCurrentUser(undefined));
  }, []);

  const logOut = () => {
    Auth.signOut().then(() => {
      setCurrentUser(undefined);
    });
  };
  const onLogin = (user: User) => {
    setCurrentUser(user);
    navigate('/', { replace: true });
  };

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
          {!currentUser && <Button color="secondary">Sign up</Button>}
          {currentUser && (
            <Tooltip title="Account">
              <IconButton ref={accountMenuAnchor} onClick={() => setAccountMenuOpen(true)}>
                <Avatar>{`${currentUser.attributes.given_name[0]}${currentUser.attributes.family_name[0]}`}</Avatar>
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
        <Menu
          open={accountMenuOpen}
          anchorEl={accountMenuAnchor.current}
          onClose={() => setAccountMenuOpen(false)}
          onClick={() => setAccountMenuOpen(false)}
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
          <MenuItem onClick={() => logOut()}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </Menu>
      </AppBar>
      <Routes>
        <Route path="/" element={<div />} />
        <Route path="/login" element={!currentUser ? <Login onLogin={onLogin} /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
