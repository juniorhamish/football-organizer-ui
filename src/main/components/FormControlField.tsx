import { FormControl } from '@mui/material';
import { ComponentProps } from 'react';

export default function FormControlField(props: Omit<ComponentProps<typeof FormControl>, 'fullWidth' | 'margin'>) {
  const { children } = props;
  return (
    <FormControl fullWidth margin="dense" {...props}>
      {children}
    </FormControl>
  );
}
