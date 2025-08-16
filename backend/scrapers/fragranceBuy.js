const axios = require('axios');
const cheerio = require('cheerio');
const { scrapePage, delay } = require('../utils/helpers');

async function scrapeFragranceBuy(perfumeName) {
  try {
    await delay(1300);
    
    const searchUrl = `https://fragrancebuy.ca/search?q=${encodeURIComponent(perfumeName)}`;
    
    const searchSelectors = {
      firstProductLink: {
        type: 'attribute',
        selector: '.card-product a, .product-item a, a[href*="/products/"]',
        attribute: 'href'
      }
    };
    
    const searchData = await scrapePage(searchUrl, searchSelectors);
    
    if (!searchData.firstProductLink) {
      return { website: 'FragranceBuy', found: false, error: 'No products found' };
    }
    
    const productUrl = searchData.firstProductLink.startsWith('http') 
      ? searchData.firstProductLink 
      : `https://fragrancebuy.ca${searchData.firstProductLink}`;
    
    const productSelectors = {
      productName: '.product__title h1, .product-custom__title h1',
      brand: '.product__text a, .product-custom__text a',
      reviews: '.junip-product-summary-review-count',
      currentPrice: '.price-item--sale .money, .price-custom__sale .money',
      originalPrice: '.price-item--regular .money, .price-custom__span .money',
      image: {
        type: 'attribute',
        selector: '.product__media img, .product-image img',
        attribute: 'src'
      },
      sizes: {
        type: 'complex',
        extract: () => {
          const sizes = [];
          document.querySelectorAll('.product-form-custom__wrapper').forEach(wrapper => {
            const input = wrapper.querySelector('input[type="radio"]');
            const volumeElement = wrapper.querySelector('.option__volume');
            const packagingElement = wrapper.querySelector('.option__packaging');
            
            if (input && volumeElement) {
              const volume = volumeElement.textContent.trim();
              const packaging = packagingElement?.textContent?.trim() || '';
              const disabled = input.classList.contains('disabled');
              
              sizes.push({
                size: volume,
                description: `${volume} ${packaging}`.trim(),
                disabled: disabled,
                inStock: !disabled
              });
            }
          });
          return sizes;
        }
      }
    };
    
    const productData = await scrapePage(productUrl, productSelectors);
    
    const outOfStock = productData.sizes?.every(s => s.disabled) || false;
    
    return {
      website: 'FragranceBuy',
      found: true,
      productName: productData.productName,
      brand: productData.brand,
      reviews: productData.reviews,
      itemNo: '',
      mainPrice: productData.currentPrice,
      retailPrice: productData.originalPrice,
      ourPrice: productData.currentPrice,
      outOfStock,
      sizes: productData.sizes || [],
      productUrl,
      image: productData.image ? (productData.image.startsWith('http') ? productData.image : `https://fragrancebuy.ca${productData.image}`) : null,
      concentration: extractConcentration(productData.productName),
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('FragranceBuy scraping error:', error.message);
    return { 
      website: 'FragranceBuy', 
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

module.exports = scrapeFragranceBuy;