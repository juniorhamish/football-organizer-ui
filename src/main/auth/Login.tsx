import { Button, Card, CardActions, CardContent, CardHeader, Container, FormControl, IconButton, InputAdornment, TextField } from '@mui/material';
import { SyntheticEvent, useRef, useState } from 'react';
import { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const formFieldStyle = { padding: 1 };
const textFieldStyle = {
  boxShadow: 8,
  borderRadius: 1,
};

export default function Login({ onLogin }: { onLogin: (user: CognitoUser) => void }) {
  const userNameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const [passwordVisible, setPasswordVisible] = useState(false);

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
              <TextField
                label="Password"
                inputRef={passwordRef}
                type={passwordVisible ? 'text' : 'password'}
                sx={textFieldStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label={`${passwordVisible ? 'Hide' : 'Show'} Password`} onClick={() => setPasswordVisible(!passwordVisible)}>
                        {passwordVisible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
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
