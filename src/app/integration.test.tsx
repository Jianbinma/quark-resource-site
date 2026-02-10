import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import SearchPage from '@/app/search/page';

// Simplified integration test approach since we are using app router
// and full E2E with navigation requires more setup (like Playwright).
// Here we verify the SearchPage logic connects inputs to outputs.

global.fetch = vi.fn();

describe('Integration Flow: Search', () => {
    beforeEach(() => {
        (global.fetch as Mock).mockClear();
    });

    it('searches and displays results correctly', async () => {
        const user = userEvent.setup();
        const mockResults = [
            { id: '1', title: 'Integration Movie', link: 'https://quark.cn/int' }
        ];

        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResults,
        });

        render(<SearchPage />);

        // 1. User types in search box
        const input = screen.getByPlaceholderText('输入电影名称...');
        await user.type(input, 'Integration');

        // 2. User clicks search button
        const button = screen.getByRole('button', { name: /搜索/i });
        await user.click(button);

        // 3. User sees results
        await waitFor(() => {
            expect(screen.getByText('Integration Movie')).toBeInTheDocument();
        });
    });
});
