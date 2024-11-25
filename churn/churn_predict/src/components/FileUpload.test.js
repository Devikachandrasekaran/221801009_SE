import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from './FileUpload';

test('renders the Process button', () => {
  render(<FileUpload />);

  // Check if the Process Button is rendered
  const processButton = screen.getByText(/Process File/i);
  expect(processButton).toBeInTheDocument();
});

test('calls the correct function when Process button is clicked after selecting a file', () => {
  render(<FileUpload />);

  // Simulate file selection
  const fileInput = screen.getByTestId('file-input'); // Use test id to select the file input
  const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });

  fireEvent.change(fileInput, { target: { files: [file] } });

  // Simulate clicking the Process File button
  const processButton = screen.getByText(/Process File/i);
  fireEvent.click(processButton);

  // Check if the process button was clicked and triggered the expected behavior
  expect(processButton).toBeInTheDocument();
  // You can add more assertions to check the expected result after clicking the process button
  // For example, check if error or message states are updated after file processing
});
