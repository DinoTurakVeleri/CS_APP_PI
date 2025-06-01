import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';

describe('Header komponenta', () => {
  it('prikazuje naslov aplikacije i gumb Logout', () => {
    // Postavi localStorage simulaciju
    vi.stubGlobal('localStorage', {
      getItem: (key) => {
        if (key === 'role') return 'user';
        return null;
      },
    });

    render(
      <BrowserRouter>
        <Header isLoggedIn={true} onLogout={() => {}} />
      </BrowserRouter>
    );

    // Provjeri osnovne elemente
    expect(screen.getByText(/consultancy & support department/i)).toBeTruthy();
    expect(screen.getByText(/logout/i)).toBeTruthy();
  });
});
