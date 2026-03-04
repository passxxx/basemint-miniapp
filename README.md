# BaseMint - Free NFT Mini App on Base

Base Mini App，使用 OnchainKit 构建的免费 NFT Mint 页面，支持 ERC-8021 Builder Code 归因。

## 📁 项目结构

```
basemint-miniapp/
├── src/
│   ├── app/
│   │   ├── .well-known/farcaster.json/route.ts  ← Farcaster manifest（Account Association）
│   │   ├── api/webhook/route.ts                  ← Webhook 端点
│   │   ├── globals.css                           ← 全局样式
│   │   ├── layout.tsx                            ← 根布局 + fc:frame 元数据
│   │   └── page.tsx                              ← 主页面
│   ├── components/
│   │   └── MintCard.tsx                          ← NFT Mint 核心组件（含归因）
│   └── lib/
│       ├── contract.ts                           ← 合约 ABI + 地址 + Builder Code
│       └── providers.tsx                         ← OnchainKit + MiniKit Provider
├── public/
│   ├── icon.png                                  ← App 图标
│   ├── og.png                                    ← OG 分享图
│   └── splash.png                                ← 启动画面
├── .env.local                                    ← 环境变量（不上传 GitHub）
├── .env.example                                  ← 环境变量模板
└── package.json
```

---

## 🚀 VSCode 终端部署步骤

### 第 1 步：在 GitHub 上新建仓库

1. 打开 https://github.com/new
2. 仓库名填 `basemint-miniapp`，选 **Public**，不要勾选任何初始化选项
3. 点 Create repository

### 第 2 步：本地初始化 + 推送到 GitHub

在 VSCode 终端里依次运行：

```bash
# 进入项目目录
cd basemint-miniapp

# 安装依赖
npm install

# 初始化 Git
git init
git add .
git commit -m "init: BaseMint Mini App"

# 关联远程仓库（替换为你的 GitHub 用户名）
git remote add origin https://github.com/你的用户名/basemint-miniapp.git
git branch -M main
git push -u origin main
```

### 第 3 步：Vercel 部署

1. 打开 https://vercel.com → Continue with GitHub
2. 点 **New Project** → Import `basemint-miniapp` 仓库
3. 在 **Environment Variables** 里填入：
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY` = 你的 API Key
   - `NEXT_PUBLIC_CONTRACT_ADDRESS` = `0xA4d53ae318AD1138c6CAC6fEF5E04e94b08083E7`
   - `NEXT_PUBLIC_CHAIN_ID` = `8453`
   - `NEXT_PUBLIC_BUILDER_CODE_SUFFIX` = `0x62635f6f6234746f61666d0b0080218021802180218021802180218021`
   - `NEXT_PUBLIC_URL` = `https://你的项目名.vercel.app`
4. 点 **Deploy**，等待部署完成
5. 复制 Vercel 域名

### 第 4 步：Account Association（Farcaster 绑定）

1. 先关闭 Vercel 部署保护：Vercel → Settings → Deployment Protection → 关掉 Vercel Authentication
2. 打开 https://build.base.org → Mini App Tools → Account Association
3. 填入 Vercel 域名 → 用 Warpcast 扫码签名
4. 复制生成的 JSON（header, payload, signature）
5. 修改 `src/app/.well-known/farcaster.json/route.ts`，把三个值填进去
6. 推送更新：

```bash
git add .
git commit -m "feat: add account association"
git push
```

Vercel 自动重新部署。

### 第 5 步：base.dev 验证

1. 打开 https://build.base.org → Settings → App URLs → Add 你的 Vercel URL
2. 拿到 base-verification meta 标签
3. 修改 `src/app/layout.tsx`，取消注释并填入验证码
4. 推送更新：

```bash
git add .
git commit -m "feat: add base verification"
git push
```

### 第 6 步：验证一切正常

1. 打开 https://build.base.org/preview → 填入 App URL → 检查 Account Association 和 Metadata
2. Warpcast 发一条帖子，粘贴 Vercel 链接，看是否正确渲染为 Mini App

---

## 🔗 ERC-8021 归因说明

本项目的每笔 Mint 交易都会在 calldata 末尾附加 Builder Code data suffix：
`0x62635f6f6234746f61666d0b0080218021802180218021802180218021`

这让 Base 能自动归因这笔交易来自你的 App，计入 base.dev Dashboard 的统计。

验证方式：Mint 后在 Basescan 查看交易的 Input Data，末尾会有这段 suffix。
