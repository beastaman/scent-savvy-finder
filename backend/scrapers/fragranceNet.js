const axios = require('axios');
const cheerio = require('cheerio');
const { scrapePage, delay } = require('../utils/helpers');

async function scrapeFragranceNet(perfumeName) {
  try {
    await delay(1000);
    
    const searchUrl = `https://www.fragrancenet.com/search?q=${encodeURIComponent(perfumeName)}`;
    
    // First get search results
    const searchSelectors = {
      firstProductLink: {
        type: 'attribute',
        selector: '.product-item a, .product-listing a, .search-result-item a',
        attribute: 'href'
      }
    };
    
    const searchData = await scrapePage(searchUrl, searchSelectors);
    
    if (!searchData.firstProductLink) {
      return { website: 'FragranceNet', found: false, error: 'No products found' };
    }
    
    const productUrl = searchData.firstProductLink.startsWith('http') 
      ? searchData.firstProductLink 
      : `https://www.fragrancenet.com${searchData.firstProductLink}`;
    
    // Extract product details using your exact selectors
    const productSelectors = {
      productName: '#brandTitle .productTitle',
      variantDesc: '#variantInfoContain .variantDesc',
      brand: '.uDesigner a',
      reviews: '.reviewJump',
      itemNo: '.itemsku .itemnum',
      mainPrice: '.pwc .pwcprice, .ourPrice .price',
      retailPrice: '.retailPrice .retailprice',
      outOfStock: '.today .oos',
      image: {
        type: 'attribute',
        selector: '.product-image img, #product-image img',
        attribute: 'src'
      },
      sizes: {
        type: 'complex',
        extract: () => {
          const sizes = [];
          document.querySelectorAll('div.box.cf').forEach(box => {
            const sizeElement = box.querySelector('.dimname .text');
            const priceElement = box.querySelector('.pricing');
            
            if (sizeElement && priceElement) {
              const sizeText = sizeElement.textContent.trim();
              const priceText = priceElement.textContent.trim();
              const dataPrice = priceElement.getAttribute('data-price');
              
              sizes.push({ 
                size: sizeText, 
                price: priceText,
                dataPrice: dataPrice
              });
            }
          });
          return sizes;
        }
      }
    };
    
    const productData = await scrapePage(productUrl, productSelectors);
    
    return {
      website: 'FragranceNet',
      found: true,
      productName: productData.productName,
      variantDesc: productData.variantDesc,
      brand: productData.brand,
      reviews: productData.reviews,
      itemNo: productData.itemNo,
      mainPrice: productData.mainPrice,
      retailPrice: productData.retailPrice,
      ourPrice: productData.mainPrice,
      outOfStock: !!productData.outOfStock,
      sizes: productData.sizes || [],
      productUrl,
      image: productData.image ? (productData.image.startsWith('http') ? productData.image : `https://www.fragrancenet.com${productData.image}`) : null,
      concentration: extractConcentration(productData.productName),
      scrapedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('FragranceNet scraping error:', error.message);
    return { 
      website: 'FragranceNet', 
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

module.exports = scrapeFragranceNet;