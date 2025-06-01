import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

describe('ProtectedRoute', () => {
  it('preusmjerava na /login ako korisnik nije prijavljen', () => {
    // Simulacija localStorage
    vi.stubGlobal('localStorage', {
      getItem: (key) => {
        if (key === 'isLoggedIn') return 'false';
        if (key === 'role') return 'user';
        return null;
      },
    });

    render(
      <MemoryRouter initialEntries={['/tajna-stranica']}>
        <ProtectedRoute requiredRole="user">
          <div>Privatni sadržaj</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Korisnik nije prijavljen → sadržaj se NE prikazuje
    const content = screen.queryByText(/Privatni sadržaj/i);
    expect(content).toBeNull(); // Očekujemo da je redirectan
  });
});
