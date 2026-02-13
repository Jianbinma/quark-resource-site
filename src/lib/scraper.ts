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
        uc?: PanSouLink[];
        xunlei?: PanSouLink[];
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

const PANSOU_INSTANCES = [
    'https://so.252035.xyz',
    'https://api.pansou.com',
    'http://pansour.top'
];

/**
 * 使用 PanSou API 搜索网盘资源
 */
export async function searchPanSou(keyword: string): Promise<ScrapedResource[]> {
    for (const instance of PANSOU_INSTANCES) {
        try {
            console.log(`🔍 Try PanSou: ${instance}`);
            const response = await axios.post<PanSouResponse>(
                `${instance}/api/search`,
                {
                    kw: keyword,
                    res: 'merge',
                    cloud_types: ['quark', 'aliyun', 'baidu', 'uc', 'xunlei'],
                    conc: 3,
                    refresh: false
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                    },
                    timeout: 12000
                }
            );

            if (response.data.code === 0 && response.data.data) {
                const apiData = response.data.data;
                const results: ScrapedResource[] = [];
                const types = ['quark', 'aliyun', 'baidu', 'uc', 'xunlei'];

                types.forEach(type => {
                    const links = apiData.merged_by_type?.[type as keyof typeof apiData.merged_by_type];
                    if (links) {
                        links.forEach((item: PanSouLink, index: number) => {
                            results.push({
                                id: `pansou-${type}-${Date.now()}-${index}`,
                                title: item.note || keyword,
                                link: item.url,
                                description: `资源来源: ${item.source || '聚合搜索'} | 更新: ${item.datetime || '近期'}`,
                                size: 'N/A',
                                source: `${type.toUpperCase()}网盘`
                            });
                        });
                    }
                });

                if (results.length > 0) {
                    console.log(`✅ ${instance} success with ${results.length} items`);
                    return results;
                }
            }
        } catch (e) {
            console.warn(`Instance ${instance} failed`);
        }
    }
    return [];
}

/**
 * UPyunSo (UP云搜) 搜索抓取
 */
export async function searchUPyunSo(keyword: string): Promise<ScrapedResource[]> {
    try {
        console.log('🔍 Try UPyunSo...');
        const searchUrl = `https://www.upyunso.com/search?keyword=${encodeURIComponent(keyword)}`;
        const response = await axios.get(searchUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 10000
        });

        const html = response.data;
        const results: ScrapedResource[] = [];
        const regex = /<a[^>]*onclick="Upso\.handleUrlAction\('([^']*)', 'open'\)"[^>]*>(.*?)<\/a>/g;
        let match;
        let count = 0;

        while ((match = regex.exec(html)) !== null && count < 15) {
            results.push({
                id: `upso-${match[1].substring(0, 10)}`,
                title: match[2].replace(/<[^>]*>/g, '').trim() || keyword,
                link: searchUrl,
                description: '来自 UP云搜 的精选资源，请点击前往原站查看下载链接。',
                size: 'N/A',
                source: 'UP云搜'
            });
            count++;
        }
        return results;
    } catch (e) {
        return [];
    }
}

/**
 * 获取备用直达搜索链接
 */
export function getAlternateSources(query: string) {
    return [
        { name: '阿里云盘搜索', url: `https://alipansou.com/search?k=${encodeURIComponent(query)}` },
        { name: '云盘狗', url: `https://www.yunpangou.com/search?q=${encodeURIComponent(query)}` },
        { name: '学霸盘', url: `https://www.xuebapan.com/s/${encodeURIComponent(query)}.html` }
    ];
}

export async function scrapeAllSources(keyword: string): Promise<ScrapedResource[]> {
    const [p1, p2] = await Promise.all([
        searchPanSou(keyword),
        searchUPyunSo(keyword)
    ]);
    return [...p1, ...p2];
}
