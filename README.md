# 🌟 ScentSavvy - Smart Fragrance Price Finder

<div align="center">
  <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop" alt="ScentSavvy Logo" width="120" height="120" style="border-radius: 20px;">
  
  **Find the Best Perfume Deals Across 8+ Major Retailers**
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## ✨ What is ScentSavvy?

ScentSavvy is a powerful, real-time fragrance price comparison tool that helps perfume enthusiasts find the best deals across multiple retailers. Save up to **50%** on your favorite fragrances with intelligent price tracking and instant comparisons.

### 🎯 Key Features

- **🔍 Smart Search**: Advanced search with filters for brand, concentration, size, and price range
- **💰 Real-time Price Comparison**: Compare prices across 8+ trusted retailers instantly  
- **📈 Price Analytics**: Track price trends and historical data with interactive charts
- **🔥 Trending Searches**: Discover popular fragrances and hot deals updated hourly
- **⚡ Lightning Fast**: Instant results with modern, responsive design
- **🛡️ Trusted Sources**: Only verified retailers with authentic products
- **📱 Mobile Optimized**: Perfect experience on all devices

## 🖥️ Screenshots

<div align="center">
  <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop" alt="ScentSavvy Homepage" style="border-radius: 10px; margin: 10px;">
</div>

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd scent-savvy-finder

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend Framework | ^18.0.0 |
| **TypeScript** | Type Safety | ^5.0.0 |
| **Vite** | Build Tool & Dev Server | ^5.0.0 |
| **Tailwind CSS** | Styling Framework | ^3.0.0 |
| **shadcn/ui** | UI Component Library | Latest |
| **Lucide React** | Icon Library | Latest |
| **Recharts** | Data Visualization | Latest |

## 📁 Project Structure

```
scent-savvy-finder/
├── 📁 src/
│   ├── 📁 components/          # Reusable UI components
│   │   ├── AdvancedSearch.tsx  # Advanced search interface
│   │   ├── SearchResults.tsx   # Search results display
│   │   ├── PriceAnalytics.tsx  # Price charts and analytics
│   │   ├── TrendingSearches.tsx # Trending fragrances
│   │   └── 📁 ui/              # shadcn/ui components
│   ├── 📁 pages/               # Page components
│   │   ├── Index.tsx           # Main homepage
│   │   └── NotFound.tsx        # 404 page
│   ├── 📁 hooks/               # Custom React hooks
│   ├── 📁 lib/                 # Utility functions
│   └── 📁 integrations/        # External integrations
├── 📁 public/                  # Static assets
└── 📄 Configuration files
```

## 🎨 Key Components

### [`AdvancedSearch.tsx`](src/components/AdvancedSearch.tsx)
Advanced search interface with filters for brand, price range, concentration, and size.

### [`SearchResults.tsx`](src/components/SearchResults.tsx)
Displays search results with retailer comparison, pricing, and availability.

### [`PriceAnalytics.tsx`](src/components/PriceAnalytics.tsx)
Interactive charts showing price trends and market analysis.

### [`TrendingSearches.tsx`](src/components/TrendingSearches.tsx)
Shows trending fragrances with discount information and popularity indicators.

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Environment Setup

1. **Development**: Uses Vite's hot module replacement for instant updates
2. **Styling**: Tailwind CSS with custom design system defined in [`src/index.css`](src/index.css)
3. **Components**: shadcn/ui components for consistent, accessible UI
4. **Icons**: Lucide React for beautiful, consistent icons

## 🌐 Deployment

### Deploy with Vercel

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Click **Import** and select your repository
3. Configure build settings (Vite preset is automatically detected)
4. Click **Deploy**

### Deploy with Netlify

1. Connect your repository to [Netlify](https://netlify.com)
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Click **Deploy site**

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Submit a pull request

### Development Setup

```bash
# Fork and clone the repo
git clone https://github.com/yourusername/scent-savvy-finder.git
cd scent-savvy-finder

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📊 Features Roadmap

- [ ] 🔔 Price alert notifications
- [ ] 💾 User favorites and wishlist
- [ ] 📧 Email price drop alerts
- [ ] 🔍 Barcode scanning for mobile
- [ ] 🌍 Multi-language support
- [ ] 📱 Progressive Web App (PWA)

## 🎯 Use Cases

- **Perfume Enthusiasts**: Find the best deals on designer fragrances
- **Gift Shoppers**: Compare prices before purchasing perfumes as gifts
- **Collectors**: Track rare and limited edition fragrance prices
- **Budget Conscious**: Set price alerts and find discounts

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues**: Open an issue in this repository
- **Questions**: Start a discussion in the Discussions tab
- **Email**: support@scentsavvy.com

---

<div align="center">
  <p>Made with ❤️ by <strong>Beastaman</strong></p>
  <p>
    <strong>ScentSavvy</strong> - Smart Fragrance Price Comparison
  </p>
</div>
