// CustomerPage.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomerPage from './CustomerPage';

describe('CustomerPage', () => {
  const customer = {
    CustomerId: 1,
    FirstName: 'John',
    LastName: 'Vick',
    Email: 'john@gmail.com',
    Phone: '1234567890',
    Address: 'UAE'
  };

  test('renders customer details', () => {
    render(<CustomerPage customer={customer} />);
    
    expect(screen.getByText('Customer Details')).toBeInTheDocument();
    expect(screen.getByText('CustomerId: 1')).toBeInTheDocument();
    expect(screen.getByText('FirstName: John')).toBeInTheDocument();
    expect(screen.getByText('LastName: Doe')).toBeInTheDocument();
    expect(screen.getByText('Email: john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Phone: 123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('Address: 123 Main St, Anytown, USA')).toBeInTheDocument();
  });
});
