// 本地资源数据库接口定义
export interface ResourceItem {
    id: string;
    title: string;
    desc: string;
    tags: string[];
    quarkLink?: string;
}

// 本地资源数据库 - 已按要求移除内容
export const LOCAL_DB: ResourceItem[] = [];
