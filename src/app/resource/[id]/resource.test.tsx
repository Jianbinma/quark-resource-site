import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import ResourcePage from '@/app/resource/[id]/page';

global.fetch = vi.fn();

// Mock next/navigation params
vi.mock('next/navigation', () => ({
    useParams: () => ({ id: '123' }),
}));

describe('Resource Detail Page', () => {
    beforeEach(() => {
        (global.fetch as Mock).mockClear();
    });

    it('displays resource details correctly', async () => {
        const mockDetail = {
            id: '123',
            title: 'Detailed Movie Name',
            description: 'This is a great movie description.',
            downloadLink: 'https://pan.quark.cn/s/key123',
            size: '2.5GB',
        };

        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockDetail,
        });

        render(<ResourcePage />);

        // 1. Check loading state initially (optional but good practice)
        // expect(screen.getByText(/加载中/i)).toBeInTheDocument();

        // 2. Wait for details to load
        await waitFor(() => {
            expect(screen.getByText('Detailed Movie Name')).toBeInTheDocument();
            expect(screen.getByText('This is a great movie description.')).toBeInTheDocument();
            expect(screen.getByText(/2.5GB/)).toBeInTheDocument();
        });

        // 3. Check for specific quark download link structure
        const link = screen.getByRole('link', { name: /获取夸克网盘链接/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', 'https://pan.quark.cn/s/key123');
    });

    it('handles error when resource not found', async () => {
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: false,
            status: 404,
        });

        render(<ResourcePage />);

        await waitFor(() => {
            expect(screen.getByText('资源不存在或已被删除')).toBeInTheDocument();
        });
    });
});
