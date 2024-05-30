import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
import Login from './Login';

test('checking component loaded', () => {
  render(<Login />);
  // Steps for testing heading element loaded
  expect(screen.queryAllByText('/Login Page/')).toBeInTheDocument();
});

test('renders login page', () => {
  render(<Login />);

  // Check if the username and password fields and login button are rendered
  expect(screen.queryByPlaceholderText('Email')).toHaveValue("");
  expect(screen.queryByPlaceholderText('Password')).toHaveValue("");
});

// test('username and password input fields', () => {
//   render(<Login />);

//   const usernameInput = screen.getByPlaceholderText('Username');
//   const passwordInput = screen.getByPlaceholderText('Password');

//   // Simulate user input
//   fireEvent.change(usernameInput, { target: { value: 'testuser' } });
//   fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

//   // Check if the values are correctly set
//   expect(usernameInput.value).toBe('testuser');
//   expect(passwordInput.value).toBe('testpassword');
// });

// test('login button click', () => {
//   const mockLogin = jest.fn();
//   render(<Login onLogin={mockLogin} />);

//   const usernameInput = screen.getByPlaceholderText('Username');
//   const passwordInput = screen.getByPlaceholderText('Password');
//   const loginButton = screen.getByText('Login');

//   // Simulate user input
//   fireEvent.change(usernameInput, { target: { value: 'testuser' } });
//   fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

//   // Simulate button click
//   fireEvent.click(loginButton);

//   // Check if the login function was called with correct values
//   expect(mockLogin).toHaveBeenCalledWith({
//     username: 'testuser',
//     password: 'testpassword',
//   });
// });
