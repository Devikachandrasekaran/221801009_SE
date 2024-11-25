import React from 'react';
import { render, screen } from '@testing-library/react';
import FileUpload from './components/FileUpload'; // Import the specific component to test

test('renders the Process button in FileUpload component', () => {
  render(<FileUpload />); // Render FileUpload component directly

  // Check if the Process Button is present
  const processButton = screen.getByText(/Process File/i);
  expect(processButton).toBeInTheDocument();
});
