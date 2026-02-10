import { NextResponse } from 'next/server';
import { LOCAL_DB } from '@/lib/db';

interface TVMazeScheduleItem {
    id: number;
    name: string;
    summary: string;
    show?: {
        id: number;
        name: string;
        summary: string;
    };
}

export async function GET() {
    const trending = [];

    // 1. Add some local high-quality resources
    const localTrend = LOCAL_DB.slice(0, 3).map(item => ({
        id: item.id,
        title: item.title,
        desc: item.desc.substring(0, 50) + '...',
        icon: '💎'
    }));
    trending.push(...localTrend);

    // 2. Add some TVMaze schedule resources
    try {
        const response = await fetch('https://api.tvmaze.com/schedule');
        const data: TVMazeScheduleItem[] = await response.json();

        const uniqueShows = new Map();
        for (const item of data) {
            const show = item.show || item;
            if (show && show.id) {
                if (!uniqueShows.has(show.id)) {
                    uniqueShows.set(show.id, {
                        id: `tvm-${show.id}`,
                        title: show.name,
                        desc: (show.summary || '').replace(/<[^>]*>?/gm, '').substring(0, 50) + '...',
                        icon: '🔥'
                    });
                }
            }
            if (uniqueShows.size >= 3) break;
        }
        trending.push(...Array.from(uniqueShows.values()));
    } catch (error) {
        console.error('Trending TVMaze API error:', error);
    }

    return NextResponse.json(trending);
}
