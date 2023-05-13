import { Container } from '@mui/material';
import { ComponentProps } from 'react';

export default function FormContainer(props: Omit<ComponentProps<typeof Container>, 'maxWidth'>) {
  const { children } = props;
  return (
    <Container maxWidth="sm" {...props}>
      {children}
    </Container>
  );
}
