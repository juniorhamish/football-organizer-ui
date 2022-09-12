import { styled } from '@mui/material/styles';
import { OutlinedInput } from '@mui/material';

const BoxShadowInputField = styled(OutlinedInput)(
  ({ theme }) => `
    box-shadow: ${theme.shadows[8]};
    border-radius: ${theme.spacing(1)};
`
);

export default BoxShadowInputField;
