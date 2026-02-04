import { render, screen } from '@testing-library/react';
import App from './App';

test('renders OctoFit Tracker welcome page', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to OctoFit Tracker/i);
  expect(welcomeElement).toBeInTheDocument();
});
