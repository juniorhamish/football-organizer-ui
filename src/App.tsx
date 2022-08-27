import { createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { Amplify } from 'aws-amplify';
import { BrowserRouter } from 'react-router-dom';
import FootballOrganizer from './main/FootballOrganizer';

import awsConfig from './aws-exports';

awsConfig.Auth.oauth.redirectSignIn = `${window.location.origin}/`;
awsConfig.Auth.oauth.redirectSignOut = `${window.location.origin}/`;

Amplify.configure(awsConfig);

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <FootballOrganizer />
      </BrowserRouter>
    </ThemeProvider>
  );
}
