import { AppBar, Button, Link, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { Link as RouterLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './auth/Login';
import { User } from './auth/User';

export default function FootballOrganizer() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User>();

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
          {currentUser && <Button color="secondary">My Profile</Button>}
          {currentUser && (
            <Button color="secondary" onClick={logOut}>
              Sign out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<div />} />
        <Route path="/login" element={!currentUser ? <Login onLogin={onLogin} /> : <Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
