import React from 'react';
import { render } from '@testing-library/react';
import App from '../containers/App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const msg = getByText(/PACKAGEFY ANALYZER/i);
  expect(msg).toBeInTheDocument();
});
