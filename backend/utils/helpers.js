const puppeteer = require('puppeteer');

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
];

const getRandomUserAgent = () => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const createBrowserInstance = async () => {
  return await puppeteer.launch({
    headless: "new", // Use new headless mode
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--window-size=1920,1080',
      '--user-agent=' + getRandomUserAgent()
    ]
  });
};

const scrapePage = async (url, selectors, options = {}) => {
  let browser;
  let page;
  
  try {
    console.log(`Scraping: ${url}`);
    browser = await createBrowserInstance();
    page = await browser.newPage();
    
    // Set random user agent and viewport
    await page.setUserAgent(getRandomUserAgent());
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set extra headers to appear more human-like
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    // Block images and stylesheets to speed up
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'stylesheet', 'font'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    // Navigate with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await page.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 30000 
        });
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await delay(2000);
      }
    }
    
    // Wait for page to load
    await delay(3000);
    
    // Extract data
    const data = await page.evaluate((selectors) => {
      const result = {};
      
      Object.keys(selectors).forEach(key => {
        const config = selectors[key];
        try {
          if (typeof config === 'string') {
            // Simple text extraction
            const element = document.querySelector(config);
            result[key] = element ? element.textContent.trim() : '';
          } else if (config.type === 'attribute') {
            // Attribute extraction
            const element = document.querySelector(config.selector);
            result[key] = element ? element.getAttribute(config.attribute) : '';
          } else if (config.type === 'multiple') {
            // Multiple elements
            const elements = document.querySelectorAll(config.selector);
            result[key] = Array.from(elements).map(el => el.textContent.trim());
          } else if (config.type === 'complex') {
            // Complex extraction
            result[key] = config.extract();
          }
        } catch (error) {
          console.log(`Error extracting ${key}:`, error.message);
          result[key] = '';
        }
      });
      
      return result;
    }, selectors);
    
    console.log(`Successfully scraped: ${url}`);
    return data;
    
  } catch (error) {
    console.error(`Scraping failed for ${url}:`, error.message);
    throw error;
  } finally {
    if (page) await page.close();
    if (browser) await browser.close();
  }
};

module.exports = {
  getRandomUserAgent,
  delay,
  scrapePage,
  createBrowserInstance
};