# 夸克资源搜索网站 - 部署指南

## 方案一：Vercel 部署（推荐）

### 优点
- ✅ 免费额度足够个人使用
- ✅ 自动CI/CD（推送代码即部署）
- ✅ 全球CDN加速
- ✅ 自动HTTPS
- ✅ 零配置，开箱即用

### 部署步骤

1. **准备Git仓库**
   ```bash
   cd /Users/hhhh1/.gemini/antigravity/scratch/quark_resource_site
   git init
   git add .
   git commit -m "Initial commit: Quark resource search site"
   ```

2. **推送到GitHub**
   ```bash
   # 在GitHub创建新仓库，然后：
   git remote add origin https://github.com/你的用户名/quark-resource-site.git
   git branch -M main
   git push -u origin main
   ```

3. **在Vercel部署**
   - 访问 https://vercel.com
   - 点击 "Import Project"
   - 连接你的GitHub仓库
   - 选择 `quark_resource_site` 项目
   - 点击 "Deploy"

4. **完成！**
   - Vercel会自动检测Next.js项目并部署
   - 几分钟后获得一个类似 `your-app.vercel.app` 的域名
   - 每次推送代码到GitHub，自动重新部署

### 环境变量（如需配置）

如果将来需要配置环境变量，在Vercel项目设置中添加：
- `NEXT_PUBLIC_API_URL` - API地址（可选）
- 其他配置...

---

## 方案二：Railway 部署

### 优点
- ✅ 免费额度：$5/月
- ✅ 支持自定义域名
- ✅ 简单部署

### 部署步骤

1. **访问** https://railway.app
2. **连接GitHub仓库**
3. **选择项目并部署**
4. **Railway自动检测并构建**

---

## 方案三：Docker + 服务器部署

### 适用场景
- 有自己的VPS/服务器
- 需要完全控制

### 部署步骤

1. **创建Dockerfile**（已在项目中）

2. **构建镜像**
   ```bash
   docker build -t quark-resource-site .
   ```

3. **运行容器**
   ```bash
   docker run -d -p 3000:3000 --name quark-site quark-resource-site
   ```

4. **配置Nginx反向代理**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **配置HTTPS（使用Let's Encrypt）**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## 方案四：使用PM2持久化运行

如果你在服务器上直接运行Node.js：

```bash
# 安装PM2
npm install -g pm2

# 构建项目
npm run build

# 启动应用
pm2 start npm --name "quark-site" -- start

# 设置开机自启
pm2 startup
pm2 save
```

---

## 性能优化建议

### 1. 启用静态生成（ISR）

对于trending页面，可以使用ISR：

```typescript
// src/app/page.tsx
export const revalidate = 3600; // 1小时重新验证
```

### 2. 图片优化

使用Next.js的Image组件（如果有图片）：
```tsx
import Image from 'next/image';
```

### 3. API缓存

为PanSou API添加缓存层，减少重复请求。

---

## 域名配置

### Vercel自定义域名
1. 在Vercel项目设置 → Domains
2. 添加你的域名（如 `quark.yourdomain.com`）
3. 在你的DNS提供商添加CNAME记录：
   ```
   CNAME quark your-app.vercel.app
   ```

### Cloudflare CDN（可选）
- 使用Cloudflare作为DNS
- 启用CDN加速
- 免费HTTPS证书

---

## 监控和维护

### Vercel Analytics
- 在Vercel项目中启用Analytics
- 查看访问量、性能指标

### 错误监控
可以集成Sentry进行错误追踪：
```bash
npm install @sentry/nextjs
```

---

## 常见问题

**Q: PanSou API在生产环境能用吗？**
A: 可以，但建议：
- 监控API可用性
- 准备降级方案（只显示本地数据库）
- 考虑自建PanSou服务

**Q: 免费部署有流量限制吗？**
A: 
- Vercel: 100GB/月流量，足够个人使用
- Railway: $5免费额度/月

**Q: 如何更新网站？**
A: 
- Vercel: 推送代码到GitHub即自动部署
- 服务器: SSH登录，`git pull` + `pm2 restart quark-site`

---

## 快速开始（推荐Vercel）

```bash
# 1. 初始化Git
git init
git add .
git commit -m "feat: PanSou API integration"

# 2. 推送到GitHub
gh repo create quark-resource-site --public --source=. --push

# 3. 访问 vercel.com 并导入项目
# 完成！
```

**几分钟后，你的网站就可以通过 `https://your-app.vercel.app` 访问了！** 🎉
