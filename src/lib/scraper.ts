import axios from 'axios';

interface ScrapedResource {
    id: string;
    title: string;
    link: string;
    description: string;
    size: string;
    source: string;
}

// PanSou API 响应类型定义
interface PanSouLink {
    url: string;
    password?: string;
    note: string;
    datetime: string;
    source: string;
    images?: string[];
}

interface PanSouData {
    total: number;
    merged_by_type?: {
        quark?: PanSouLink[];
        baidu?: PanSouLink[];
        aliyun?: PanSouLink[];
    };
    results?: Array<{
        title: string;
        content: string;
        links: Array<{
            type: string;
            url: string;
            password?: string;
        }>;
        datetime?: string;
    }>;
}

interface PanSouResponse {
    code: number;
    message: string;
    data: PanSouData;
}

/**
 * 使用 PanSou API 搜索网盘资源
 * @param keyword 搜索关键词
 * @returns 夸克网盘资源列表
 */
export async function searchPanSou(keyword: string): Promise<ScrapedResource[]> {
    try {
        console.log('🔍 Searching PanSou API for:', keyword);

        const response = await axios.post<PanSouResponse>(
            'https://so.252035.xyz/api/search',
            {
                kw: keyword,
                res: 'merge',           // 返回合并后的结果
                cloud_types: ['quark'], // 只搜索夸克网盘
                conc: 3,                // 并发数
                refresh: false          // 使用缓存
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                },
                timeout: 15000 // 15秒超时（某些搜索可能较慢）
            }
        );

        if (response.data.code !== 0) {
            console.error('❌ PanSou API error code:', response.data.code, response.data.message);
            return [];
        }

        const apiData = response.data.data;
        console.log('✅ PanSou API response:', response.status, 'Total:', apiData.total);

        const results: ScrapedResource[] = [];

        // 从 merged_by_type 提取夸克网盘链接
        if (apiData.merged_by_type?.quark) {
            apiData.merged_by_type.quark.forEach((item, index) => {
                results.push({
                    id: `pansou-quark-${Date.now()}-${index}`,
                    title: item.note || keyword,
                    link: item.url,
                    description: `来源: ${item.source || 'PanSou'} | 更新时间: ${item.datetime ? new Date(item.datetime).toLocaleDateString('zh-CN') : '未知'}`,
                    size: 'N/A', // PanSou不提供文件大小信息
                    source: 'PanSou搜索'
                });
            });
        }

        // 如果 merged_by_type 为空，尝试从 results 提取
        if (results.length === 0 && apiData.results) {
            apiData.results.forEach((item, index) => {
                // 只提取夸克链接
                const quarkLinks = item.links.filter(link => link.type === 'quark');
                quarkLinks.forEach((link, linkIndex) => {
                    results.push({
                        id: `pansou-result-${Date.now()}-${index}-${linkIndex}`,
                        title: item.title || keyword,
                        link: link.url,
                        description: item.content?.substring(0, 150) || '夸克网盘资源',
                        size: 'N/A',
                        source: 'PanSou搜索'
                    });
                });
            });
        }

        console.log(`📦 Found ${results.length} Quark resources from PanSou`);
        return results;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('❌ PanSou API error:', error.message, error.response?.status);
        } else {
            console.error('❌ PanSou search error:', error);
        }
        return [];
    }
}

/**
 * 备用：搜索所有来源（保留旧函数名用于兼容）
 */
export async function scrapeAllSources(keyword: string): Promise<ScrapedResource[]> {
    return searchPanSou(keyword);
}
