'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TrendingItem {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export default function Home() {
  const [trending, setTrending] = useState<TrendingItem[]>([]);

  useEffect(() => {
    fetch('/api/trending')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTrending(data);
        }
      })
      .catch(err => console.error('Failed to fetch trending:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <main className="relative z-10 container mx-auto px-4 text-center py-20">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            夸克资源
          </span>
          <br />
          一键搜索下载
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          汇聚全网最新最全的夸克网盘资源。电影、剧集、文档、软件，你想要的这里都有。
          极速搜索，免费下载。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link href="/search" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1">
            开始搜索
            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute -inset-3 rounded-xl bg-blue-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
          </Link>

          <Link href="/search" className="px-8 py-4 text-lg font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
            热门推荐
          </Link>
        </div>

        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-8 inline-block border-b-2 border-blue-100 pb-2">
          今日全网热搜资源
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
          {trending.length > 0 ? (
            trending.map((item) => (
              <Link key={item.id} href={`/resource/${item.id}`}>
                <div className="h-full bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded-full">Trending</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{item.desc}</p>
                </div>
              </Link>
            ))
          ) : (
            // Loading/Fallback skeleton or static features if api fails
            [
              { title: '极速更新', desc: '全网资源实时同步，最新大片抢先看。', icon: '⚡' },
              { title: '海量库存', desc: '千万级资源库，覆盖影视、音乐、学习资料。', icon: '📚' },
              { title: '完全免费', desc: '无任何隐形消费，纯净无广告体验。', icon: '💎' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
