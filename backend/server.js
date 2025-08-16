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
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production' 
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
  ),
  transports: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === 'production' 
      ? [new winston.transports.File({ filename: 'error.log', level: 'error' })]
      : []
    )
  ]
});

// Trust proxy for Render
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "https:", "http:"],
    },
  },
}));
app.use(compression());

// CORS configuration for production
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://scent-savvy.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '10mb' }));

// Rate limiting (more restrictive for production)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 50 : 100,
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    scrapers: 7,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    scrapers: 7,
    environment: process.env.NODE_ENV || 'development'
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
    
    // Log detailed results for debugging
    results.forEach((result, index) => {
      const scraperNames = ['FragranceNet', 'FragranceX', 'FragranceShop', 'FragranceBuy', 'AuraFragrance', 'FragFlex', 'Jomashop'];
      if (result.status === 'fulfilled') {
        if (result.value.found) {
          logger.info(`${scraperNames[index]} - Success: ${result.value.productName}`);
        } else {
          logger.warn(`${scraperNames[index]} - No results: ${result.value.error}`);
        }
      } else {
        logger.error(`${scraperNames[index]} - Failed: ${result.reason?.message}`);
      }
    });
    
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
        name: successfulResults[0].productName || query,
        brand: successfulResults[0].brand || "Unknown Brand",
        image: successfulResults[0].image || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
        concentration: concentration || successfulResults[0].concentration || "Eau de Parfum",
        size: size || "100ml",
        rating: 4.5,
        reviews: parseInt(successfulResults[0].reviews?.replace(/\D/g, '') || '0') || 0
      },
      prices: successfulResults.map(result => ({
        retailer: result.website,
        price: parseFloat(result.mainPrice?.replace(/[^0-9.]/g, '') || '0'),
        stock: result.outOfStock ? "Out of Stock" : "In Stock",
        url: result.productUrl || '#',
        savings: Math.floor(Math.random() * 30) + 10,
        originalPrice: parseFloat(result.retailPrice?.replace(/[^0-9.]/g, '') || '0') || 
                      (parseFloat(result.mainPrice?.replace(/[^0-9.]/g, '') || '0') * 1.3),
        shipping: Math.random() > 0.5 ? "Free shipping" : "$5.95",
        eta: `${Math.floor(Math.random() * 5) + 2}-${Math.floor(Math.random() * 3) + 5} business days`,
        logo: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=32&h=32&fit=crop`
      })).filter(p => p.price > 0)
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
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
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

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 ScentSavvy API Server running on port ${PORT}`);
  logger.info(`📊 ${process.env.NODE_ENV || 'development'} mode`);
  logger.info(`🔍 7 scrapers loaded and ready`);
});

module.exports = app;