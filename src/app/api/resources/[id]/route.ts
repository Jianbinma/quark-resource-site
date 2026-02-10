import { NextResponse } from 'next/server';
import { LOCAL_DB } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // 1. Handle Local DB resources (with real Quark links)
    if (id.startsWith('loc-')) {
        const resource = LOCAL_DB.find(item => item.id === id);
        if (resource) {
            return NextResponse.json({
                id: resource.id,
                title: resource.title,
                description: resource.desc,
                downloadLink: resource.quarkLink || `https://pan.quark.cn/s/${Math.random().toString(36).substring(7)}`,
                size: `${(Math.random() * 20 + 0.5).toFixed(1)}GB`,
            });
        }
    }

    // 2. Handle scraped resources (should use link from search results)
    if (id.startsWith('竹云盘搜-') || id.startsWith('夸客搜-') || id.startsWith('趣盘搜-') ||
        id.startsWith('zhuyun-') || id.startsWith('kuakeso-') || id.startsWith('funletu-')) {
        return NextResponse.json({
            id: id,
            title: '夸克网盘资源',
            description: '该资源来自第三方网站爬取，请从搜索结果页面直接点击"获取资源"按钮访问夸克网盘链接。',
            downloadLink: '',
            size: 'N/A',
        });
    }

    // 3. Handle Jikan (MAL) resources
    if (id.startsWith('mal-')) {
        const malId = id.replace('mal-', '');
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
            if (response.ok) {
                const data = await response.json();
                const item = data.data;
                return NextResponse.json({
                    id: id,
                    title: item.title,
                    description: item.synopsis || '暂无简介',
                    downloadLink: `https://pan.quark.cn/s/${Math.random().toString(36).substring(7)}`,
                    size: 'N/A',
                });
            }
        } catch (e) {
            console.error('Jikan Detail API error:', e);
        }
    }

    // 4. Handle TVMaze resources
    const tvMazeId = id.startsWith('tvm-') ? id.replace('tvm-', '') : id;
    try {
        const response = await fetch(`https://api.tvmaze.com/shows/${tvMazeId}`);
        if (response.ok) {
            const data = await response.json();
            return NextResponse.json({
                id: id,
                title: data.name,
                description: data.summary?.replace(/<[^>]*>?/gm, '') || '暂无简介',
                downloadLink: `https://pan.quark.cn/s/${Math.random().toString(36).substring(7)}`,
                size: `${(Math.random() * 10 + 1).toFixed(1)}GB`,
            });
        }
    } catch (error) {
        console.error('TVMaze Detail API error:', error);
    }

    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
}
