import * as React from 'react';
import App from '@app/index';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, test } from 'vitest';

describe('App tests', () => {
  test('should render default App component', () => {
    const { asFragment } = render(<App />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render a nav-toggle button', () => {
    render(<App />);

    expect(screen.getByRole('button', { name: 'Global navigation' })).toBeVisible();
  });

  it('should expand the sidebar on larger viewports', () => {
    render(<App />);

    window.dispatchEvent(new Event('resize'));

    expect(screen.getByRole('link', { name: 'Page template', hidden: true })).toBeInTheDocument();
  });

  it('should hide the sidebar when clicking the nav-toggle button', async () => {
    const user = userEvent.setup();

    render(<App />);

    window.dispatchEvent(new Event('resize'));
    const button = screen.getByRole('button', { name: 'Global navigation' });

    expect(screen.getByRole('link', { name: 'Page template', hidden: true })).toBeInTheDocument();

    await user.click(button);

    expect(screen.queryByRole('link', { name: 'Page template', hidden: true })).not.toBeInTheDocument();
  });
});
