const axios = require('axios');
const cheerio = require('cheerio');
const { scrapePage, delay } = require('../utils/helpers');

async function scrapeJomashop(perfumeName) {
  try {
    await delay(1500);
    
    const searchUrl = `https://www.jomashop.com/search?q=${encodeURIComponent(perfumeName)}`;
    
    const searchSelectors = {
      firstProductLink: {
        type: 'attribute',
        selector: '.product-item a, a[href*=".html"]',
        attribute: 'href'
      }
    };
    
    const searchData = await scrapePage(searchUrl, searchSelectors);
    
    if (!searchData.firstProductLink) {
      return { website: 'Jomashop', found: false, error: 'No products found' };
    }
    
    const productUrl = searchData.firstProductLink.startsWith('http') 
      ? searchData.firstProductLink 
      : `https://www.jomashop.com${searchData.firstProductLink}`;
    
    const productSelectors = {
      fullTitle: 'h1.brand-name-container',
      brand: '.brand-name',
      productName: '#product-h1-product-name',
      itemNo: '.product-info-stock-sku',
      reviews: '.yotpo-bottomline a',
      stockLabel: '.tag-item.stock-label',
      discountLabel: '.tag-item.discount-label',
      retailPrice: '.retail-price-wrapper span:last-child',
      ourPrice: '.now-price span',
      currentSize: '.current-option-detail strong',
      image: {
        type: 'attribute',
        selector: '.product-image img, #product-image img',
        attribute: 'src'
      },
      moreSizes: {
        type: 'complex',
        extract: () => {
          const sizes = [];
          document.querySelectorAll('.child-product-item').forEach(item => {
            const sizeElement = item.querySelector('.item-size');
            const priceElement = item.querySelector('.item-price');
            
            if (sizeElement && priceElement) {
              sizes.push({
                size: sizeElement.textContent.trim(),
                price: priceElement.textContent.trim()
              });
            }
          });
          return sizes;
        }
      }
    };
    
    const productData = await scrapePage(productUrl, productSelectors);
    
    // Extract brand and product name from title structure
    const fullTitle = productData.fullTitle || '';
    const brandMatch = fullTitle.match(/^([^-]+)/);
    const brand = productData.brand || (brandMatch ? brandMatch[1].trim() : '');
    
    const productNameMatch = fullTitle.match(/by\s+(.+?)(?:\s+Item No\.|$)/);
    const productName = productData.productName || (productNameMatch ? productNameMatch[1].trim() : fullTitle);
    
    const outOfStock = productData.stockLabel?.toLowerCase().includes('out of stock') ||
                      !productData.stockLabel?.toLowerCase().includes('in stock');
    
    // Combine current size with other sizes
    const allSizes = [
      { 
        size: productData.currentSize, 
        price: productData.ourPrice,
        current: true 
      },
      ...productData.moreSizes
    ];
    
    return {
      website: 'Jomashop',
      found: true,
      productName,
      brand,
      reviews: productData.reviews,
      itemNo: productData.itemNo?.replace('Item No.', '').trim(),
      mainPrice: productData.ourPrice,
      retailPrice: productData.retailPrice,
      ourPrice: productData.ourPrice,
      outOfStock,
      sizes: allSizes,
      productUrl,
      stockStatus: productData.stockLabel,
      discount: productData.discountLabel,
      image: productData.image,
      concentration: extractConcentration(productName),
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Jomashop scraping error:', error.message);
    return { 
      website: 'Jomashop', 
      found: false, 
      error: error.message 
    };
  }
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

module.exports = scrapeJomashop;