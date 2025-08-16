const axios = require('axios');
const cheerio = require('cheerio');
const { scrapePage, delay } = require('../utils/helpers');

async function scrapeFragFlex(perfumeName) {
  try {
    await delay(1100);
    
    const searchUrl = `https://fragflex.com/search?q=${encodeURIComponent(perfumeName)}`;
    
    const searchSelectors = {
      firstProductLink: {
        type: 'attribute',
        selector: '.product-item a, a[href*="/products/"]',
        attribute: 'href'
      }
    };
    
    const searchData = await scrapePage(searchUrl, searchSelectors);
    
    if (!searchData.firstProductLink) {
      return { website: 'FragFlex', found: false, error: 'No products found' };
    }
    
    const productUrl = searchData.firstProductLink.startsWith('http') 
      ? searchData.firstProductLink 
      : `https://fragflex.com${searchData.firstProductLink}`;
    
    const productSelectors = {
      productName: '.ctm-product-title h1',
      brand: '.ctm-vendor-link',
      sku: '.ctm-sku p',
      reviews: '.junip-product-summary-review-count',
      image: {
        type: 'attribute',
        selector: '.product-single__photo img, .product-image img',
        attribute: 'src'
      },
      sizes: {
        type: 'complex',
        extract: () => {
          const sizes = [];
          
          // Extract from owl carousel items using your exact structure
          document.querySelectorAll('.owl-carousel .item').forEach(item => {
            const input = item.querySelector('input[type="radio"]');
            const label = item.querySelector('.ctm-variant-label');
            const priceElement = item.querySelector('.variant_price');
            const badgeElement = item.querySelector('.variant_badge');
            
            if (input && label && priceElement) {
              const sizeText = input.value || label.textContent.trim();
              const priceText = priceElement.textContent.trim();
              const soldOut = priceText.includes('SOLD OUT') || input.classList.contains('disabled');
              const discountText = badgeElement?.textContent?.trim() || '';
              
              sizes.push({ 
                size: sizeText.replace(/^\d+ml\s*/, '').trim() || sizeText,
                price: priceText,
                discount: discountText,
                available: !soldOut
              });
            }
          });
          
          return sizes;
        }
      }
    };
    
    const productData = await scrapePage(productUrl, productSelectors);
    
    // Get main price from available sizes
    const availableSizes = productData.sizes?.filter(s => s.available) || [];
    let mainPrice = '';
    
    if (availableSizes.length > 0) {
      const prices = availableSizes.map(s => {
        const priceMatch = s.price.match(/\$[\d,]+\.?\d*/);
        return priceMatch ? parseFloat(priceMatch[0].replace(/[$,]/g, '')) : 0;
      }).filter(p => p > 0);
      
      if (prices.length > 0) {
        mainPrice = `$${Math.min(...prices).toFixed(2)}`;
      }
    }
    
    const outOfStock = availableSizes.length === 0 || 
                      productData.sizes?.every(s => !s.available);
    
    return {
      website: 'FragFlex',
      found: true,
      productName: productData.productName,
      brand: productData.brand,
      reviews: productData.reviews,
      itemNo: productData.sku,
      mainPrice,
      retailPrice: '',
      ourPrice: mainPrice,
      outOfStock,
      sizes: productData.sizes || [],
      productUrl,
      image: productData.image ? (productData.image.startsWith('http') ? productData.image : `https://fragflex.com${productData.image}`) : null,
      concentration: extractConcentration(productData.productName),
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('FragFlex scraping error:', error.message);
    return { 
      website: 'FragFlex', 
      found: false, 
      error: error.message 
    };
  }
}

function extractConcentration(productName) {
  const concentrations = ['EDP', 'EDT', 'Parfum', 'Cologne', 'Eau de Parfum', 'Eau de Toilette'];
  for (const conc of concentrations) {
    if (productName?.toLowerCase().includes(conc.toLowerCase())) {
      return conc;
    }
  }
  return 'EDT';
}

module.exports = scrapeFragFlex;