import React from 'react';
import { render } from '@testing-library/react';
import Result from '../containers/Result';

test('renders learn react link', () => {
  const { getByText } = render(<Result />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
