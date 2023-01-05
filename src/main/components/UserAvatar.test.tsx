import { render, screen } from '@testing-library/react';
import UserAvatar from './UserAvatar';

describe('user avatar', () => {
  it('should show the users initials', () => {
    render(<UserAvatar name="David Johnston" />);

    expect(screen.getByText('DJ')).toBeInTheDocument();
  });
  it('should set the background colour based on the name', () => {
    render(<UserAvatar name="David Johnston" />);

    expect(screen.getByText('DJ')).toHaveStyle('background-color: #F76B23');
  });
});
