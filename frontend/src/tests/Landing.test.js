import React from 'react';
import { render, screen } from '@testing-library/react';
import Landing from '../pages/Landing/Landing.js';


test('Landing renders and shows the JustPass title', () => {
  render(<Landing />);
  const titleElement = screen.getByText(/JustPass/i);
  expect(titleElement);
});

test('Landing renders and shows the Track your grades and pass that class! text', () => {
  render(<Landing />);
  const textElement = screen.getByText(/Track your grades and pass that class!/i);
  expect(textElement);
});

test('Landing renders and shows the Logo image', () => {
    render(<Landing />);
    const logoElement = screen.getByAltText(/Logo/i);
    expect(logoElement);
});