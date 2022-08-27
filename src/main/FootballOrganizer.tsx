import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { CognitoUser } from '@aws-amplify/auth';
import Login from './auth/Login';

export default function FootballOrganizer() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CognitoUser>();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch(() => {
        setCurrentUser(undefined);
      });
  }, []);

  const logOut = () => {
    Auth.signOut().then(() => {
      setCurrentUser(undefined);
    });
  };

  const onLogin = (user: CognitoUser) => {
    setCurrentUser(user);
    navigate('/', { replace: true });
  };

  return (
    <div>
      <AppBar position="sticky" sx={{ marginBottom: '50px' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Football Organizer
          </Typography>
          {!currentUser && (
            <Link to="/login">
              <Button color="inherit">Sign in</Button>
            </Link>
          )}
          {!currentUser && <Button color="inherit">Sign up</Button>}
          {currentUser && <Button color="inherit">My Profile</Button>}
          {currentUser && (
            <Button color="inherit" onClick={logOut}>
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
