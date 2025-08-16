const axios = require('axios');
const cheerio = require('cheerio');
const { scrapePage, delay } = require('../utils/helpers');

async function scrapeAuraFragrance(perfumeName) {
  try {
    await delay(1400);
    
    const searchUrl = `https://www.aurafragrance.com/search?q=${encodeURIComponent(perfumeName)}`;
    
    const searchSelectors = {
      firstProductLink: {
        type: 'attribute',
        selector: '.product-item a, a[href*="/products/"]',
        attribute: 'href'
      }
    };
    
    const searchData = await scrapePage(searchUrl, searchSelectors);
    
    if (!searchData.firstProductLink) {
      return { website: 'AuraFragrance', found: false, error: 'No products found' };
    }
    
    const productUrl = searchData.firstProductLink.startsWith('http') 
      ? searchData.firstProductLink 
      : `https://www.aurafragrance.com${searchData.firstProductLink}`;
    
    const productSelectors = {
      productName: 'h1.h2[itemprop="name"] p, h1.h2[itemprop="name"]',
      currentPrice: '#productPrice-product-template',
      discountText: '#comparePrice-product-template',
      image: {
        type: 'attribute',
        selector: '.product-single__photo img, .product-image img',
        attribute: 'src'
      },
      sizes: {
        type: 'complex',
        extract: () => {
          const sizes = [];
          
          // Extract from swatch buttons using your exact structure
          document.querySelectorAll('.swatch-button').forEach(button => {
            const titleElement = button.querySelector('.swatch-button-title-text span');
            const priceElement = button.querySelector('.swatch-button-price-hidden span');
            const isSelected = button.classList.contains('swatch-selected');
            
            if (titleElement && priceElement) {
              sizes.push({ 
                size: titleElement.textContent.trim(), 
                price: priceElement.textContent.trim(),
                selected: isSelected
              });
            }
          });
          
          // Extract from select options as fallback
          document.querySelectorAll('.product-variants option').forEach(option => {
            const optionText = option.textContent.trim();
            const isSelected = option.hasAttribute('selected');
            const priceMatch = optionText.match(/\$[\d,]+\.?\d*/);
            const sizeMatch = optionText.match(/^([^-]+)/);
            
            if (sizeMatch && priceMatch) {
              const existingSize = sizes.find(s => s.size.includes(sizeMatch[1].trim()));
              if (!existingSize) {
                sizes.push({
                  size: sizeMatch[1].trim(),
                  price: priceMatch[0],
                  selected: !!isSelected
                });
              }
            }
          });
          
          return sizes;
        }
      }
    };
    
    const productData = await scrapePage(productUrl, productSelectors);
    
    const outOfStock = !productData.sizes?.length || 
                      productData.sizes.every(s => s.price === 'Sold Out');
    
    return {
      website: 'AuraFragrance',
      found: true,
      productName: productData.productName,
      brand: extractBrandFromName(productData.productName),
      reviews: '',
      itemNo: '',
      mainPrice: productData.currentPrice,
      retailPrice: '',
      ourPrice: productData.currentPrice,
      outOfStock,
      sizes: productData.sizes || [],
      productUrl,
      discount: productData.discountText,
      image: productData.image ? (productData.image.startsWith('http') ? productData.image : `https://www.aurafragrance.com${productData.image}`) : null,
      concentration: extractConcentration(productData.productName),
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('AuraFragrance scraping error:', error.message);
    return { 
      website: 'AuraFragrance', 
      found: false, 
      error: error.message 
    };
  }
}

function extractBrandFromName(productName) {
  const commonBrands = ['Versace', 'Dior', 'Chanel', 'Tom Ford', 'Creed', 'Calvin Klein', 'Giorgio Armani', 'Dolce Gabbana'];
  for (const brand of commonBrands) {
    if (productName?.toLowerCase().includes(brand.toLowerCase())) {
      return brand;
    }
  }
  return 'Unknown';
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

module.exports = scrapeAuraFragrance;