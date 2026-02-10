'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

type ResourceDetail = {
    id: string;
    title: string;
    description: string;
    downloadLink: string;
    size: string;
};

export default function ResourcePage() {
    const params = useParams();
    const [resource, setResource] = useState<ResourceDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchResource() {
            try {
                const res = await fetch(`/api/resources/${params.id}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setError('资源不存在或已被删除');
                    } else {
                        setError('获取资源失败');
                    }
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                setResource(data);
            } catch {
                setError('网络错误');
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            fetchResource();
        }
    }, [params.id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-500 font-medium text-lg">
            {error}
        </div>
    );

    return (
        <div className="container mx-auto p-8 max-w-3xl min-h-screen flex items-center">
            {resource && (
                <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl animate-fade-in-up">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                        <h1 className="text-3xl font-bold mb-3 relative z-10">{resource.title}</h1>
                        <span className="inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/10">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                            </svg>
                            文件大小: {resource.size}
                        </span>
                    </div>

                    <div className="p-8">
                        <h2 className="text-gray-900 font-semibold mb-2">资源简介</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-8 text-lg bg-gray-50 p-4 rounded-lg border border-gray-100">
                            {resource.description}
                        </p>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <a
                                href={resource.downloadLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 border border-transparent px-8 py-3.5 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                获取夸克网盘链接
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
