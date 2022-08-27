import { Button, Card, CardActions, CardContent, CardHeader, Container, FormControl, TextField } from '@mui/material';
import { SyntheticEvent, useRef } from 'react';
import { Auth } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';

const formFieldStyle = { padding: 1 };
const textFieldStyle = {
  boxShadow: 8,
  borderRadius: 5,
};

export default function Login({ onLogin }: { onLogin: (user: CognitoUser) => void }) {
  const userNameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  const login = (event: SyntheticEvent) => {
    event.preventDefault();
    Auth.signIn(userNameRef.current?.value as string, passwordRef.current?.value).then((user) => {
      onLogin(user);
    });
  };
  return (
    <Container maxWidth="sm">
      <Card raised>
        <CardHeader title="Sign In" />
        <form onSubmit={login} aria-label="Sign In Form">
          <CardContent>
            <FormControl fullWidth sx={formFieldStyle}>
              <TextField label="Username" inputRef={userNameRef} sx={textFieldStyle} />
            </FormControl>
            <FormControl fullWidth sx={formFieldStyle}>
              <TextField label="Password" inputRef={passwordRef} type="password" sx={textFieldStyle} />
            </FormControl>
          </CardContent>
          <CardActions>
            <Button type="submit">Submit</Button>
          </CardActions>
        </form>
      </Card>
    </Container>
  );
}
