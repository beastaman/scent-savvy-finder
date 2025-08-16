const axios = require('axios');
const cheerio = require('cheerio');
const { scrapePage, delay } = require('../utils/helpers');

async function scrapeFragranceShop(perfumeName) {
  try {
    await delay(1200);
    
    const searchUrl = `https://www.fragranceshop.com/?s=${encodeURIComponent(perfumeName)}&post_type=product`;
    
    const searchSelectors = {
      firstProductLink: {
        type: 'attribute',
        selector: '.woocommerce-loop-product__link, .product-item a, a[href*="/product/"]',
        attribute: 'href'
      }
    };
    
    const searchData = await scrapePage(searchUrl, searchSelectors);
    
    if (!searchData.firstProductLink) {
      return { website: 'FragranceShop', found: false, error: 'No products found' };
    }
    
    const productUrl = searchData.firstProductLink.startsWith('http') 
      ? searchData.firstProductLink 
      : `https://www.fragranceshop.com${searchData.firstProductLink}`;
    
    const productSelectors = {
      productName: 'h1.product_title.entry-title',
      brand: '.product-brand-text-link',
      reviews: '.woocommerce-product-rating .count',
      sku: '.sku',
      currentPrice: '.woocommerce-variation-price ins .woocommerce-Price-amount, .price ins .woocommerce-Price-amount, .price .woocommerce-Price-amount',
      originalPrice: '.woocommerce-variation-price del .woocommerce-Price-amount, .price del .woocommerce-Price-amount',
      inStock: '.stock.in-stock',
      outOfStock: '.stock.out-of-stock',
      image: {
        type: 'attribute',
        selector: '.woocommerce-product-gallery__image img, .product-image img',
        attribute: 'src'
      },
      sizes: {
        type: 'complex',
        extract: () => {
          const sizes = [];
          
          // Extract from radio buttons using your exact structure
          document.querySelectorAll('.bas_radio_variations input[type="radio"]').forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
              sizes.push({ 
                size: label.textContent.trim(), 
                value: input.value,
                enabled: input.classList.contains('enabled')
              });
            }
          });
          
          // Extract from select options as fallback
          document.querySelectorAll('.variations select option').forEach(option => {
            const size = option.textContent.trim();
            const value = option.value;
            if (size && size !== 'Choose an option' && value) {
              sizes.push({ size, value });
            }
          });
          
          return sizes;
        }
      }
    };
    
    const productData = await scrapePage(productUrl, productSelectors);
    
    return {
      website: 'FragranceShop',
      found: true,
      productName: productData.productName,
      brand: productData.brand,
      reviews: productData.reviews,
      itemNo: productData.sku,
      mainPrice: productData.currentPrice,
      retailPrice: productData.originalPrice,
      ourPrice: productData.currentPrice,
      outOfStock: !!productData.outOfStock && !productData.inStock,
      sizes: productData.sizes || [],
      productUrl,
      image: productData.image ? (productData.image.startsWith('http') ? productData.image : `https://www.fragranceshop.com${productData.image}`) : null,
      concentration: extractConcentration(productData.productName),
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('FragranceShop scraping error:', error.message);
    return { 
      website: 'FragranceShop', 
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

module.exports = scrapeFragranceShop;