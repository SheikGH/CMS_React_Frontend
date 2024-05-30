import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
import Header from './Header';

test('checking component loaded', () => {
  render(<Header />);
  // Steps for testing heading element loaded
  expect(screen.queryAllByText('/Customer Management System/')).toBeInTheDocument();
});
