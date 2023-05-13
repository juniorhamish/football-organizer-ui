import { Grid } from '@mui/material';
import { ComponentProps } from 'react';

export default function FormGrid(props: Omit<ComponentProps<typeof Grid>, 'container' | 'spacing'>) {
  const { children } = props;
  return (
    <Grid container spacing={1} {...props}>
      {children}
    </Grid>
  );
}
