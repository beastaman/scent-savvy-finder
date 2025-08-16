const axios = require('axios');
const cheerio = require('cheerio');
const { scrapePage, delay } = require('../utils/helpers');

async function scrapeFragranceX(perfumeName) {
  try {
    await delay(1200);
    
    const searchUrl = `https://www.fragrancex.com/search?q=${encodeURIComponent(perfumeName)}`;
    
    const searchSelectors = {
      firstProductLink: {
        type: 'attribute',
        selector: '.product-link, .search-item a, a[href*="/products/"]',
        attribute: 'href'
      }
    };
    
    const searchData = await scrapePage(searchUrl, searchSelectors);
    
    if (!searchData.firstProductLink) {
      return { website: 'FragranceX', found: false, error: 'No products found' };
    }
    
    const productUrl = searchData.firstProductLink.startsWith('http') 
      ? searchData.firstProductLink 
      : `https://www.fragrancex.com${searchData.firstProductLink}`;
    
    const productSelectors = {
      productName: '.product-header-name .perfume-name.serif.product-name-short',
      brand: '.product-header-name .brand-name a',
      reviews: '.product-review .review-count a',
      selectedSku: '.selected-sku p',
      image: {
        type: 'attribute',
        selector: '.product-listing-img img',
        attribute: 'src'
      },
      products: {
        type: 'complex',
        extract: () => {
          const products = [];
          document.querySelectorAll('.product.media').forEach(product => {
            const sizeDesc = product.querySelector('.listing-description')?.textContent?.trim();
            const skuElement = product.querySelector('.listing-sku, .product-sku');
            const stockStatus = product.querySelector('.in-stock-status')?.textContent?.trim();
            
            // Extract price from the complex structure
            const priceContainer = product.querySelector('.listing-price-container .price-value');
            let fullPrice = '';
            
            if (priceContainer) {
              const symbol = priceContainer.querySelector('.price-symbol')?.textContent?.trim() || '';
              const basePrice = priceContainer.querySelector('.base-price-val')?.textContent?.trim() || '';
              const supPrice = priceContainer.querySelector('.sup-price-val')?.textContent?.trim() || '';
              
              fullPrice = symbol + basePrice + (supPrice ? '.' + supPrice : '');
            }
            
            if (sizeDesc && fullPrice) {
              products.push({
                size: sizeDesc,
                price: fullPrice,
                inStock: stockStatus?.toLowerCase().includes('in stock'),
                itemSku: skuElement?.textContent?.replace('Item #', '').trim()
              });
            }
          });
          return products;
        }
      }
    };
    
    const productData = await scrapePage(productUrl, productSelectors);
    
    // Get main price from the first available product
    const prices = productData.products?.map(p => {
      const numPrice = parseFloat(p.price?.replace(/[^\d.]/g, '') || '0');
      return numPrice;
    }).filter(p => p > 0) || [];
    
    const mainPrice = prices.length > 0 ? `$${Math.min(...prices).toFixed(2)}` : '';
    const retailPrice = prices.length > 0 ? `$${Math.max(...prices).toFixed(2)}` : '';
    
    return {
      website: 'FragranceX',
      found: true,
      productName: productData.productName,
      brand: productData.brand || extractBrandFromName(productData.productName),
      reviews: productData.reviews,
      itemNo: productData.selectedSku,
      mainPrice,
      retailPrice,
      ourPrice: mainPrice,
      outOfStock: !productData.products?.some(p => p.inStock),
      sizes: productData.products || [],
      productUrl,
      image: productData.image ? (productData.image.startsWith('http') ? productData.image : `https://www.fragrancex.com${productData.image}`) : null,
      concentration: extractConcentration(productData.productName),
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('FragranceX scraping error:', error.message);
    return { 
      website: 'FragranceX', 
      found: false, 
      error: error.message 
    };
  }
}

function extractBrandFromName(productName) {
  const commonBrands = ['Versace', 'Dior', 'Chanel', 'Tom Ford', 'Creed', 'Dolce Gabbana'];
  for (const brand of commonBrands) {
    if (productName?.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return 'Unknown';
}

function extractConcentration(productName) {
  const concentrations = ['EDP', 'EDT', 'Parfum', 'Cologne'];
  for (const conc of concentrations) {
    if (productName?.toLowerCase().includes(conc.toLowerCase())) {
      return conc;
    }
  }
  return 'EDT';
}

module.exports = scrapeFragranceX;