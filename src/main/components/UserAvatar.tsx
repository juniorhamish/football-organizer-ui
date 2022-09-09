import { Avatar } from '@mui/material';

type UserAvatarProps = { name: string };

const stringToColor = (string: string) => {
  let hash = 0;
  let color = '#';
  let i;

  for (i = 0; i < string.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (i = 0; i < 3; i += 1) {
    // eslint-disable-next-line no-bitwise
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};
const initials = (name: string) => `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`;

export default function UserAvatar({ name }: UserAvatarProps) {
  return <Avatar sx={{ bgcolor: stringToColor(name) }}>{initials(name)}</Avatar>;
}
