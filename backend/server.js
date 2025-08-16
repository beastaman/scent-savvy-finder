const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const winston = require('winston');
require('dotenv').config();

// Import enhanced scrapers
const fragranceNetScraper = require('./scrapers/fragranceNet');
const fragranceXScraper = require('./scrapers/fragranceX');
const fragranceShopScraper = require('./scrapers/fragranceShop');
const fragranceBuyScraper = require('./scrapers/fragranceBuy');
const auraFragranceScraper = require('./scrapers/auraFragrance');
const fragFlexScraper = require('./scrapers/fragFlex');
const jomashopScraper = require('./scrapers/jomashop');

const app = express();
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://scent-savvy.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased for testing
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: 15 * 60
  }
});
app.use('/api/', limiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    scrapers: 7
  });
});

// Enhanced search endpoint
app.get('/api/search', async (req, res) => {
  const { q: query, brand, priceMin, priceMax, concentration, size } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const cacheKey = `search:${query}:${brand || ''}:${priceMin || ''}:${priceMax || ''}:${concentration || ''}:${size || ''}`;
  const cached = cache.get(cacheKey);
  
  if (cached) {
    logger.info(`Cache hit for query: ${query}`);
    return res.json(cached);
  }

  logger.info(`Searching for: ${query}`, { brand, priceMin, priceMax, concentration, size });

  try {
    // Run all scrapers in parallel
    const scraperPromises = [
      fragranceNetScraper(query),
      fragranceXScraper(query),
      fragranceShopScraper(query),
      fragranceBuyScraper(query),
      auraFragranceScraper(query),
      fragFlexScraper(query),
      jomashopScraper(query)
    ];

    const results = await Promise.allSettled(scraperPromises);
    const successfulResults = results
      .filter(result => result.status === 'fulfilled' && result.value.found)
      .map(result => result.value);

    if (successfulResults.length === 0) {
      logger.warn(`No results found for query: ${query}`);
      return res.json({
        fragrance: {
          name: query,
          brand: "Unknown Brand",
          image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
          concentration: "Eau de Parfum",
          size: "100ml",
          rating: 4.5,
          reviews: 0
        },
        prices: []
      });
    }

    // Transform scraper results to frontend format
    const transformedResults = {
      fragrance: {
        name: successfulResults[0].productName,
        brand: successfulResults[0].brand || "Unknown Brand",
        image: successfulResults[0].imageUrl || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
        concentration: concentration || "Eau de Parfum",
        size: size || "100ml",
        rating: 4.5,
        reviews: parseInt(successfulResults[0].reviews?.replace(/\D/g, '') || '0') || 0
      },
      prices: successfulResults.map(result => ({
        retailer: result.website,
        price: parseFloat(result.mainPrice?.replace(/[^0-9.]/g, '') || '0'),
        stock: result.outOfStock ? "Out of Stock" : "In Stock",
        url: result.productUrl || '#',
        savings: Math.floor(Math.random() * 30) + 10, // Mock savings percentage
        originalPrice: parseFloat(result.retailPrice?.replace(/[^0-9.]/g, '') || '0') || 
                      (parseFloat(result.mainPrice?.replace(/[^0-9.]/g, '') || '0') * 1.3),
        shipping: Math.random() > 0.5 ? "Free shipping" : "$5.95",
        eta: `${Math.floor(Math.random() * 5) + 2}-${Math.floor(Math.random() * 3) + 5} business days`,
        logo: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=32&h=32&fit=crop`
      }))
    };

    // Apply filters
    if (brand) {
      transformedResults.prices = transformedResults.prices.filter(p => 
        p.retailer.toLowerCase().includes(brand.toLowerCase())
      );
    }
    
    if (priceMin) {
      transformedResults.prices = transformedResults.prices.filter(p => 
        p.price >= parseFloat(priceMin)
      );
    }
    
    if (priceMax) {
      transformedResults.prices = transformedResults.prices.filter(p => 
        p.price <= parseFloat(priceMax)
      );
    }

    // Cache the results
    cache.set(cacheKey, transformedResults);
    
    logger.info(`Search completed for: ${query}`, { 
      resultsCount: transformedResults.prices.length,
      retailers: transformedResults.prices.map(p => p.retailer)
    });

    res.json(transformedResults);

  } catch (error) {
    logger.error('Search error:', error);
    res.status(500).json({ 
      error: 'Internal server error during search',
      message: error.message 
    });
  }
});

// Trending searches endpoint
app.get('/api/trending', (req, res) => {
  const trendingSearches = [
    { query: "Dior Sauvage", searchCount: 1250, trend: "up" },
    { query: "Chanel No. 5", searchCount: 980, trend: "hot" },
    { query: "Tom Ford Black Orchid", searchCount: 750, trend: "up" },
    { query: "Creed Aventus", searchCount: 650, trend: "stable" },
    { query: "YSL Black Opium", searchCount: 580, trend: "up" }
  ];
  
  res.json({ trending: trendingSearches });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 3002;

const server = app.listen(PORT, () => {
  logger.info(`🚀 ScentSavvy API Server running on port ${PORT}`);
  logger.info(`📊 ${PORT === 3002 ? 'Development' : 'Production'} mode`);
  logger.info(`🔍 7 scrapers loaded and ready`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    
    // Try the next port
    const newPort = PORT + 1;
    server.listen(newPort, () => {
      logger.info(`🚀 ScentSavvy API Server running on port ${newPort}`);
      logger.info(`📊 ${newPort === 3002 ? 'Development' : 'Production'} mode`);
      logger.info(`🔍 7 scrapers loaded and ready`);
    });
  } else {
    logger.error('Server error:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

module.exports = app;