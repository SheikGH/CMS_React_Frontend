import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from './Register';

test('checking component loaded', () => {
  render(<Register />);
  // Steps for testing heading element loaded
  expect(screen.queryByText('/Register Page/')).toBeInTheDocument();
});
