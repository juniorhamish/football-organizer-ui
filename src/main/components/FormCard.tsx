import { Card } from '@mui/material';
import { ComponentProps } from 'react';

export default function FormCard(props: Omit<ComponentProps<typeof Card>, 'raised' | 'component'>) {
  const { children } = props;
  return (
    <Card raised component="form" {...props}>
      {children}
    </Card>
  );
}
