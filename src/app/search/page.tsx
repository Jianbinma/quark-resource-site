'use client';

import Link from 'next/link';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface SearchResult {
    id: string;
    title: string;
    link: string;
    description: string;
    size: string;
    source: string;
}

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        console.log('=== SEARCH START ===');
        console.log('Query:', query);
        setLoading(true);

        try {
            const url = `/api/search?q=${encodeURIComponent(query)}`;
            console.log('Fetching:', url);
            const res = await fetch(url);
            console.log('Response status:', res.status, res.ok);

            if (res.ok) {
                const data = await res.json();
                console.log('Data received:', data);
                console.log('Is array?', Array.isArray(data));
                console.log('Length:', data?.length);

                setResults(data || []);
                console.log('=== SET RESULTS CALLED ===');
            } else {
                console.error('API returned error status');
                setResults([]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setResults([]);
        } finally {
            setLoading(false);
            console.log('=== SEARCH END ===');
        }
    };

    console.log('RENDER - Results count:', results.length);

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient">
                夸克资源搜索
            </h1>
            <div className="flex gap-4 mb-8 bg-white p-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl">
                <Input
                    type="text"
                    placeholder="输入电影名称..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                    className="flex-grow text-lg py-3"
                />
                <Button
                    onClick={handleSearch}
                    disabled={loading || !query.trim()}
                    size="lg"
                    className="min-w-[120px]"
                >
                    {loading ? '搜索中...' : '搜索'}
                </Button>
            </div>

            <div className="transition-all duration-500 ease-in-out">
                {loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">搜索中...</p>
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <div>
                        <p className="mb-4 text-gray-600">找到 {results.length} 个结果</p>
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {results.map((item) => {
                                const isQuarkLink = item.link && item.link.includes('pan.quark.cn');
                                const href = isQuarkLink ? item.link : `/resource/${item.id}`;
                                const target = isQuarkLink ? '_blank' : '_self';

                                return (
                                    <li key={item.id} className="transform transition duration-300 hover:scale-[1.02]">
                                        {isQuarkLink ? (
                                            <a
                                                href={href}
                                                target={target}
                                                rel="noopener noreferrer"
                                                className="block h-full bg-white border border-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg hover:border-blue-100 group"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                                                        {item.title}
                                                    </h3>
                                                    <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full whitespace-nowrap">
                                                        {item.source}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">{item.size}</span>
                                                    <div className="text-sm text-blue-600 flex items-center gap-1">
                                                        <span>获取资源</span>
                                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </a>
                                        ) : (
                                            <Link
                                                href={href}
                                                className="block h-full bg-white border border-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg hover:border-blue-100 group"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                                                        {item.title}
                                                    </h3>
                                                    {item.source && (
                                                        <span className="ml-2 px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full whitespace-nowrap">
                                                            {item.source}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
                                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-auto">
                                                    <span>点击查看详情</span>
                                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </div>
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {!loading && results.length === 0 && query && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg mb-6">未找到相关资源，可以尝试以下外部搜索引擎：</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href={`https://alipansou.com/search?k=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-gray-50 transition-colors">猫狸盘搜 (阿里/夸克)</a>
                            <a href={`https://www.yunpangou.com/search?q=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-gray-50 transition-colors">云盘狗</a>
                            <a href={`https://www.upyunso.com/search?keyword=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-gray-50 transition-colors">UP云搜</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
