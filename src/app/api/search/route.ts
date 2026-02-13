import { NextResponse } from 'next/server';
import { LOCAL_DB } from '@/lib/db';
import { scrapeAllSources } from '@/lib/scraper';

interface SearchResult {
    id: string;
    title: string;
    link: string;
    description: string;
    size: string;
    source: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json([]);
    }

    const allResults: SearchResult[] = [];

    // 核心网盘搜索 (聚合多个来源)
    try {
        console.log('🔍 Executing Cloud Resource Search for:', q);
        const cloudResults = await scrapeAllSources(q);
        if (cloudResults.length > 0) {
            console.log(`✅ Cloud search returned ${cloudResults.length} results`);
            allResults.push(...cloudResults);
        } else {
            console.log('⚠️ No cloud results found');
        }
    } catch (error) {
        console.error('❌ Cloud search error:', error);
    }

    return NextResponse.json(allResults);
}
