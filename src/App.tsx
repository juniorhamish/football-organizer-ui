import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';

Amplify.configure(awsExports);

export default function App() {
  return (
    <Authenticator signUpAttributes={['email', 'given_name', 'family_name']} socialProviders={['amazon', 'facebook', 'google']}>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.attributes?.given_name}</h1>
          <button type="button" onClick={signOut}>
            Sign out
          </button>
        </main>
      )}
    </Authenticator>
  );
}
