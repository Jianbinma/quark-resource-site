import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type Mock } from 'vitest';
import SearchPage from '@/app/search/page';

// 模拟 fetch API
global.fetch = vi.fn();

describe('Search Page', () => {
    beforeEach(() => {
        (global.fetch as Mock).mockClear();
    });

    it('allows users to search for movies', async () => {
        const mockResults = [
            { id: '1', title: 'Test Movie 1', link: 'https://quark.cn/1' },
            { id: '2', title: 'Test Movie 2', link: 'https://quark.cn/2' },
        ];

        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResults,
        });

        render(<SearchPage />);

        // 1. 检查是否存在搜索输入框和按钮
        const input = screen.getByPlaceholderText('输入电影名称...');
        const button = screen.getByRole('button', { name: /搜索/i });

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();

        // 2. 模拟用户输入和点击搜索
        fireEvent.change(input, { target: { value: 'Test Movie' } });
        fireEvent.click(button);

        // 3. 验证是否显示了搜索结果
        await waitFor(() => {
            expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
            expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
        });
    });

    it('displays no results message when search returns empty', async () => {
        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        render(<SearchPage />);
        const input = screen.getByPlaceholderText('输入电影名称...');
        const button = screen.getByRole('button', { name: /搜索/i });

        fireEvent.change(input, { target: { value: 'Nonexistent Movie' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText('未找到相关资源，换个关键词试试？')).toBeInTheDocument();
        });
    });
});
