import { Backdrop, CircularProgress } from '@mui/material';

export default function ProgressIndicator({ open, label }: { open: boolean; label: string }) {
  return (
    <Backdrop open={open} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress aria-label={label} />
    </Backdrop>
  );
}
