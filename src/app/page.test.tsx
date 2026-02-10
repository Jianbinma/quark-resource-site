import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import Home from './page';

// Mock fetch to avoid "Invalid URL" errors in JSDOM
global.fetch = vi.fn();

describe('Landing Page', () => {
    beforeEach(() => {
        (global.fetch as Mock).mockResolvedValue({
            ok: true,
            json: async () => []
        });
    });

    it('renders the main heading and search link', () => {
        render(<Home />);

        // Check for main heading
        expect(screen.getByText(/夸克资源/i)).toBeInTheDocument();

        // Check for search link
        const searchLink = screen.getByRole('link', { name: /开始搜索/i });
        expect(searchLink).toBeInTheDocument();
        expect(searchLink).toHaveAttribute('href', '/search');
    });
});
