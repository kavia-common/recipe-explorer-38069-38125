import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Sign In UI', () => {
  render(<App />);
  // Check for "Sign In" button from the SignIn component
  const btn = screen.getByRole('button', { name: /sign in/i });
  expect(btn).toBeInTheDocument();

  // Check for "Email" label to ensure the form scaffold is present
  expect(screen.getByText(/email/i)).toBeInTheDocument();
});
