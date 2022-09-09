import { render } from '@testing-library/react';
import UserAvatar from './UserAvatar';

describe('user avatar', () => {
  it('should show the users initials', () => {
    const { getByText } = render(<UserAvatar name="David Johnston" />);

    expect(getByText('DJ')).toBeInTheDocument();
  });
  it('should set the background colour based on the name', () => {
    const { container } = render(<UserAvatar name="David Johnston" />);

    expect(container.firstChild).toHaveStyle('background-color: #F76B23');
  });
});
