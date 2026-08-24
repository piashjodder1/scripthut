import { Category, Order, Script, User, WebsiteSettings } from './types';

export const INITIAL_SETTINGS: WebsiteSettings = {
  websiteName: 'ScriptVault',
  websiteTagline: 'Premium Source Code & Ready-Made Scripts Marketplace',
  websiteDescription: 'Browse, preview, and acquire high-performance web applications, mobile apps, SaaS boilerplates, and automated tools with instant Telegram support.',
  logoUrl: '',
  faviconUrl: '',
  metaTitle: 'ScriptVault - Premium Ready-Made Scripts & Source Code Marketplace',
  metaDescription: 'Discover, preview, and acquire high-performance web applications, mobile scripts, SaaS boilerplates, and tools with live demos and instant Telegram support.',
  metaKeywords: 'scripts, source code, web apps, saas boilerplate, react, nextjs, laravel, php, marketplace',
  ogImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
  enableSearchIndexing: true,
  headerAnnouncement: '🔥 New release: 50% discount on all Next.js 15 fullstack starters this week!',
  headerAnnouncementEnabled: false,
  telegramSupportUrl: 'https://t.me/ScriptVaultSupport',
  telegramUsername: 'ScriptVaultSupport',
  currencySymbol: '$',
  currencyCode: 'USD',
  socialLinks: {
    twitter: 'https://x.com/scriptvault',
    telegram: 'https://t.me/ScriptVaultSupport',
    youtube: 'https://youtube.com/@scriptvault',
    github: 'https://github.com/scriptvault',
    facebook: '',
    instagram: '',
  },
  contactEmail: 'support@scriptvault.dev',
  adminEmail: 'admin@scriptvault.dev',
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-react',
    name: 'React & Next.js',
    slug: 'react-nextjs',
    description: 'Modern, high-speed single-page applications and Next.js fullstack solutions.',
    status: 'active',
    iconName: 'Atom',
    color: '#0284c7',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cat-laravel',
    name: 'Laravel & PHP',
    slug: 'laravel-php',
    description: 'Robust PHP and Laravel 11 based systems with MVC architecture & MySQL database.',
    status: 'active',
    iconName: 'Server',
    color: '#ef4444',
    createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'cat-gaming',
    name: 'Gaming & Tournaments',
    slug: 'gaming',
    description: 'Esports platforms, tournament management scripts, leaderboard systems, and game engines.',
    status: 'active',
    iconName: 'Gamepad2',
    color: '#8b5cf6',
    createdAt: '2026-01-12T10:00:00Z',
  },
  {
    id: 'cat-saas',
    name: 'SaaS & Boilerplates',
    slug: 'saas',
    description: 'Multi-tenant subscription platforms, AI wrappers, and modern startup boilerplates.',
    status: 'active',
    iconName: 'Layers',
    color: '#2563eb',
    createdAt: '2026-01-14T10:00:00Z',
  },
  {
    id: 'cat-ecommerce',
    name: 'E-commerce & Storefronts',
    slug: 'ecommerce',
    description: 'Digital downloads, multi-vendor marketplaces, and physical goods shopping carts.',
    status: 'active',
    iconName: 'ShoppingBag',
    color: '#10b981',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'cat-wordpress',
    name: 'WordPress & Plugins',
    slug: 'wordpress',
    description: 'High converting themes, custom plugin engines, and WooCommerce extensions.',
    status: 'active',
    iconName: 'Globe',
    color: '#3b82f6',
    createdAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'cat-tools',
    name: 'Tools & Utilities',
    slug: 'tools',
    description: 'SEO tools, image converters, URL shorteners, scrapers, and automation scripts.',
    status: 'active',
    iconName: 'Wrench',
    color: '#f59e0b',
    createdAt: '2026-01-18T10:00:00Z',
  },
];

export const INITIAL_SCRIPTS: Script[] = [
  {
    id: 'script-1',
    slug: 'gaming-tournament-pro-script',
    title: 'Gaming Tournament Pro - Esports Management Script',
    shortDescription: 'Complete esports tournament hosting script with brackets, team registrations, live room code distributions, and automated leaderboards.',
    fullDescription: `### Overview
**Gaming Tournament Pro** is an all-in-one tournament management platform designed for esports organizers, gaming communities, and streaming hosts. It enables hassle-free brackets, automated slot assignments, room ID & password broadcasts, and dynamic result verification.

### Core Features
- **Dynamic Tournament Brackets**: Single elimination, double elimination, and round-robin tournament formats.
- **Automated Slot Booking**: Gamers can create teams, register squads, or join solo matches with instant team ID allocation.
- **Match Room Manager**: Admin or match moderators can push room ID & password directly to checked-in participants with notification popups.
- **Live Leaderboard & Point Calculator**: Automatic point calculation based on kills, placement points, and tie-breakers.
- **Telegram & Discord Bot Ready**: Built-in webhook triggers for notifying winners and squad captains.
- **Mobile Responsive Design**: 100% mobile-friendly player portal with dark/light gaming aesthetic.

### Tech Stack & System Requirements
- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend/Database**: Node.js / Express or PHP 8.2+ with MySQL 8.0
- **Authentication**: JWT Token auth with OTP verification support
- **Hosting**: Compatible with cPanel, VPS, Ubuntu, Cloud Run, Vercel, or AWS.`,
    mainImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=1200&auto=format&fit=crop',
    ],
    regularPrice: 79,
    discountPrice: 39,
    liveDemoUrl: 'https://demo.gamingtournamentpro.example.com',
    buyUrl: 'https://store.example.com/checkout/gaming-tournament-pro',
    categorySlug: 'gaming',
    status: 'published',
    featured: true,
    tags: ['Gaming', 'Esports', 'Tournament', 'React', 'Leaderboard'],
    version: 'v2.4.0',
    framework: 'React / Node / Tailwind',
    views: 1420,
    salesCount: 88,
    createdAt: '2026-01-20T12:00:00Z',
    updatedAt: '2026-02-15T15:30:00Z',
  },
  {
    id: 'script-2',
    slug: 'saas-starter-kit-nextjs',
    title: 'Modern SaaS Boilerplate & Multi-Tenant Engine',
    shortDescription: 'Production-ready Next.js 15 starter with auth, role-based access control, dark/light theme, admin panel, and clean API structure.',
    fullDescription: `### Overview
Launch your next SaaS startup in hours instead of weeks. **Modern SaaS Boilerplate** comes equipped with multi-tenancy, clean role-based permissions, automated emails, customer portals, and a modern dashboard UI.

### What is Included
- **Modular Dashboard Architecture**: Clean sidebar, breadcrumbs, command bar palette, and responsive analytics cards.
- **Role-Based Access Control**: SuperAdmin, Workspace Owner, Member, and Viewer permission levels.
- **Pre-built User Management**: User profile edit, avatar uploader, session manager, and 2FA toggles.
- **REST & Server Actions API**: Type-safe controllers with full TypeScript definitions and schema validation.
- **Comprehensive Documentation**: Step-by-step installation instructions with environment variables template.

### Tech Stack
- Next.js 15 App Router, TypeScript, Tailwind CSS, Lucide React
- Drizzle ORM / Prisma ready with PostgreSQL / SQLite / MySQL
- Clean code architecture with zero clutter and top tier Lighthouse score 99+`,
    mainImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
    ],
    regularPrice: 99,
    discountPrice: 49,
    liveDemoUrl: 'https://demo.saasstarter.example.com',
    buyUrl: 'https://store.example.com/checkout/nextjs-saas-starter',
    categorySlug: 'saas',
    status: 'published',
    featured: true,
    tags: ['Next.js', 'TypeScript', 'SaaS', 'Boilerplate', 'Tailwind'],
    version: 'v3.1.2',
    framework: 'Next.js 15 / TypeScript',
    views: 2890,
    salesCount: 164,
    createdAt: '2026-01-22T09:15:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'script-3',
    slug: 'digital-product-marketplace-laravel',
    title: 'Digital Downloads & Source Code Marketplace (Laravel 11)',
    shortDescription: 'Full-featured digital marketplace for selling scripts, software, graphics, and themes with instant file delivery and license keys.',
    fullDescription: `### Overview
A clean, battle-tested digital goods storefront built with **Laravel 11**. Sell your software, PHP scripts, plugins, graphic assets, or ebooks with protected download links and dynamic discount rules.

### Key Highlights
- **Instant Secure Downloads**: Protected temporary download links to prevent unauthorized file sharing.
- **Dynamic Coupon & Discount Engine**: Percentage or flat discounts with countdown timers and usage limits.
- **Product Reviews & Rating**: Verified buyer review submission with star ratings and admin moderation.
- **Admin Analytics**: Revenue trends, top selling scripts, conversion rate graphs, and customer search terms.
- **SEO Optimized**: Auto-generated XML sitemap, schema markup, OpenGraph cards, and fast page loads.

### System Requirements
- PHP >= 8.2 with BCMath, Ctype, cURL, DOM, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML extensions.
- MySQL 5.7+ or MariaDB 10.3+`,
    mainImage: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1556742049-0a67e5572293?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop',
    ],
    regularPrice: 89,
    discountPrice: 45,
    liveDemoUrl: 'https://demo.laravelmarketplace.example.com',
    buyUrl: 'https://store.example.com/checkout/digital-marketplace-laravel',
    categorySlug: 'laravel-php',
    status: 'published',
    featured: true,
    tags: ['Laravel', 'PHP', 'Marketplace', 'E-commerce', 'Digital Store'],
    version: 'v4.0.1',
    framework: 'Laravel 11 / MySQL',
    views: 1980,
    salesCount: 112,
    createdAt: '2026-01-25T14:20:00Z',
    updatedAt: '2026-02-10T11:45:00Z',
  },
  {
    id: 'script-4',
    slug: 'all-in-one-seo-web-tools-script',
    title: 'All-in-One SEO & Web Utility Tools Portal',
    shortDescription: 'High-traffic ready tools platform featuring 50+ client-side & API utilities: image compressor, JSON formatter, domain lookup, and QR generator.',
    fullDescription: `### Overview
Generate passive organic traffic and ad revenue with the **All-in-One SEO & Web Utility Tools** script. Includes 50+ pre-built, responsive micro-tools ready for quick monetization and custom branding.

### Tools Included
- **Developer Tools**: JSON Validator/Formatter, Base64 Encoder/Decoder, CSS Minifier, HTML Entity Decoder, RegEx Tester.
- **SEO & Webmaster Tools**: Meta Tag Generator, OpenGraph Previewer, Robots.txt Generator, XML Sitemap Pinger.
- **Image & Content Tools**: Client-side Image WebP Converter, SVG Optimizer, Color Palette Generator, QR Code Studio with Logo embedding.
- **Text & Content**: Word & Character Counter, Case Converter, Lorem Ipsum Generator, Markdown to HTML converter.

### Monetization Ready
- Integrated responsive ad spaces (Header, In-tool, Sidebar, and Footer banners).
- Ultra-fast client-side computations minimizing server load.`,
    mainImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    ],
    regularPrice: 49,
    discountPrice: 24,
    liveDemoUrl: 'https://demo.seotools.example.com',
    buyUrl: 'https://store.example.com/checkout/seo-web-tools',
    categorySlug: 'tools',
    status: 'published',
    featured: false,
    tags: ['Tools', 'SEO', 'JavaScript', 'Utilities', 'AdSense Ready'],
    version: 'v1.8.0',
    framework: 'React / Next.js / Tailwind',
    views: 3120,
    salesCount: 205,
    createdAt: '2026-01-28T08:00:00Z',
    updatedAt: '2026-02-12T09:30:00Z',
  },
  {
    id: 'script-5',
    slug: 'crypto-arbitrage-dashboard-react',
    title: 'Crypto Market & Live Arbitrage Scanner Dashboard',
    shortDescription: 'Real-time cryptocurrency analytics, price disparity scanner, candle chart visualizer, and customizable watchlists with live WebSocket feeds.',
    fullDescription: `### Overview
**Crypto Market & Arbitrage Scanner** offers a slick dark/light financial workstation for crypto traders and data analysts. Tracks 500+ spot trading pairs across top exchanges with real-time websocket order book feeds.

### Capabilities
- **Cross-Exchange Disparity Monitor**: Live delta scanner highlighting price differences across Binance, Coinbase, Kraken, and Bybit.
- **Interactive TradingView / D3 Charts**: Multi-timeframe charts with candlestick, volume overlay, and indicator toggles.
- **Customizable Watchlists**: Pin favorite tokens, set price alert sound cues, and filter by 24h volume.
- **Export Capabilities**: Download historical spread data to CSV or JSON formats.`,
    mainImage: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop',
    ],
    regularPrice: 120,
    discountPrice: 65,
    liveDemoUrl: 'https://demo.cryptodash.example.com',
    buyUrl: 'https://store.example.com/checkout/crypto-scanner-dashboard',
    categorySlug: 'react-nextjs',
    status: 'published',
    featured: true,
    tags: ['Crypto', 'Dashboard', 'React', 'Charts', 'WebSockets'],
    version: 'v2.0.4',
    framework: 'React / Tailwind / Chart.js',
    views: 1750,
    salesCount: 64,
    createdAt: '2026-02-01T16:00:00Z',
    updatedAt: '2026-02-17T18:10:00Z',
  },
  {
    id: 'script-6',
    slug: 'wordpress-auto-content-curator-plugin',
    title: 'WP Auto-Post & Multi-Feed Content Curator Pro',
    shortDescription: 'Automated WordPress plugin to fetch RSS feeds, YouTube playlists, and podcast episodes with scheduled AI rewriting and featured image generation.',
    fullDescription: `### Overview
**WP Auto-Post & Multi-Feed Content Curator** empowers WordPress site owners to automate content pipelines from RSS feeds, YouTube channels, and API endpoints with scheduled taxonomy assignment.

### Features
- **Multi-Source Aggregator**: Ingest RSS feeds, Atom XML, Reddit threads, and YouTube metadata.
- **Custom Post Type Support**: Compatible with standard posts, WooCommerce products, or custom post types.
- **Automatic Image Downloader**: Downloads remote images and sets them as native WordPress featured media.
- **Keyword Filters**: Whitelist or blacklist posts matching target keywords to ensure editorial quality.`,
    mainImage: 'https://images.unsplash.com/photo-1507842229451-79b1b9028c6d?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1507842229451-79b1b9028c6d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop',
    ],
    regularPrice: 45,
    discountPrice: 29,
    liveDemoUrl: 'https://demo.wpautopost.example.com',
    buyUrl: 'https://store.example.com/checkout/wp-auto-content-curator',
    categorySlug: 'wordpress',
    status: 'published',
    featured: false,
    tags: ['WordPress', 'Plugin', 'Automation', 'RSS', 'Content'],
    version: 'v1.4.2',
    framework: 'WordPress 6.4+ / PHP',
    views: 890,
    salesCount: 42,
    createdAt: '2026-02-05T11:00:00Z',
    updatedAt: '2026-02-14T14:20:00Z',
  },
  {
    id: 'script-7',
    slug: 'multi-vendor-food-delivery-script',
    title: 'FoodExpress - Multi-Branch Restaurant & Ordering Script',
    shortDescription: 'Modern single-page food ordering platform with live order tracker, rider management, branch picker, and customizable menu variants.',
    fullDescription: `### Overview
**FoodExpress** provides a lightning-fast ordering experience for restaurants, cloud kitchens, and multi-vendor food cooperatives. Includes live order status timeline and Telegram order alerts.

### Highlights
- **Live Order Progress Tracker**: Interactive visual steps: Order Placed -> Kitchen Preparing -> On The Way -> Delivered.
- **Modifiers & Add-ons**: Add meal sizes, toppings, spice levels, and dietary notes.
- **Telegram Order Dispatch**: Automatically ping restaurant manager and kitchen staff with formatted order receipt on Telegram.
- **Branch / Location Selector**: Geo-distance lookup to route orders to the closest kitchen.`,
    mainImage: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop',
    ],
    regularPrice: 85,
    discountPrice: 42,
    liveDemoUrl: 'https://demo.foodexpress.example.com',
    buyUrl: 'https://store.example.com/checkout/foodexpress-ordering-script',
    categorySlug: 'ecommerce',
    status: 'published',
    featured: false,
    tags: ['Food Delivery', 'Restaurant', 'React', 'E-commerce', 'Ordering'],
    version: 'v2.1.0',
    framework: 'React / Node / Tailwind',
    views: 1210,
    salesCount: 57,
    createdAt: '2026-02-08T13:30:00Z',
    updatedAt: '2026-02-16T12:00:00Z',
  },
  {
    id: 'script-8',
    slug: 'ai-prompt-marketplace-generator',
    title: 'PromptHub - AI Prompt Marketplace & Testing Sandbox',
    shortDescription: 'Sell and test curated AI prompt templates for Midjourney, ChatGPT, Stable Diffusion, and Gemini with interactive variable preview.',
    fullDescription: `### Overview
**PromptHub** allows digital creators to monetize high-quality AI prompt recipes with live variable substitutions, model parameters guide, and instant preview gallery.

### Key Capabilities
- **Variable Placeholders**: Users can fill input forms to see final compiled prompts in real-time.
- **Copy with 1-Click**: Instant clipboard copier with formatted parameters.
- **Sample Outputs Carousel**: High-resolution generated asset showcase for each prompt.
- **Category Tagging**: Filter by Photorealistic, Logo Design, Marketing Copy, Code Assistant, and UI Mockups.`,
    mainImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop',
    ],
    regularPrice: 55,
    discountPrice: null, // Regular price only example
    liveDemoUrl: 'https://demo.prompthub.example.com',
    buyUrl: 'https://store.example.com/checkout/prompthub-marketplace',
    categorySlug: 'saas',
    status: 'published',
    featured: false,
    tags: ['AI', 'Prompt Marketplace', 'Next.js', 'Digital Goods'],
    version: 'v1.1.0',
    framework: 'Next.js / Tailwind',
    views: 950,
    salesCount: 38,
    createdAt: '2026-02-10T17:00:00Z',
    updatedAt: '2026-02-19T08:15:00Z',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-demo-1',
    name: 'Alex Developer',
    email: 'user@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    role: 'user',
    createdAt: '2026-02-01T10:00:00Z',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'order-demo-1',
    orderNumber: 'ORD-98214',
    userId: 'user-demo-1',
    userEmail: 'user@example.com',
    userName: 'Alex Developer',
    items: [
      {
        scriptId: 'script-1',
        title: 'Gaming Tournament Pro - Esports Management Script',
        slug: 'gaming-tournament-pro-script',
        price: 39,
        downloadUrl: 'https://downloads.example.com/packages/gaming-tournament-pro-v2.4.0.zip',
        downloadPassword: 'PRO-TOURNAMENT-2026',
        fileSize: '68.4 MB',
        version: 'v2.4.0',
        mainImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
        framework: 'React / Node / Tailwind',
      },
    ],
    totalAmount: 39,
    currencySymbol: '$',
    paymentMethod: 'Instant Direct Access',
    status: 'completed',
    downloadAccessGranted: true,
    createdAt: '2026-02-18T14:20:00Z',
  },
];
