import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import Users from '../pages/Users';

// Mock localStorage
vi.stubGlobal('localStorage', {
  getItem: vi.fn(() => 'mocked-token'),
});

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { user_id: 1, name: 'Dino', username: 'dinot', role: 'ADMIN' },
        { user_id: 2, name: 'Ivana', username: 'ivana123', role: 'USER' },
      ]),
  })
);

describe('Users komponenta', () => {
  it('prikazuje korisnike nakon dohvaćanja', async () => {
    await act(async () => {
      render(<Users />);
    });

    expect(screen.getByText(/users/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Dino')).toBeInTheDocument();
      expect(screen.getByText('Ivana')).toBeInTheDocument();
      expect(screen.getByText('dinot')).toBeInTheDocument();
      expect(screen.getByText('ivana123')).toBeInTheDocument();
    });
  });
});
