import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PerfumeResult {
  website: string;
  productName: string;
  productPrice: string;
  productLink: string;
  productImage: string;
  inStock: boolean;
  error?: string;
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Scraper configurations
const scraperConfigs = [
  {
    name: 'FragranceNet',
    baseUrl: 'https://www.fragrancenet.com',
    searchUrl: 'https://www.fragrancenet.com/search',
    searchParam: 'q'
  },
  {
    name: 'FragranceX', 
    baseUrl: 'https://www.fragrancex.com',
    searchUrl: 'https://www.fragrancex.com/search',
    searchParam: 'q'
  },
  {
    name: 'FragranceShop',
    baseUrl: 'https://www.fragranceshop.com',
    searchUrl: 'https://www.fragranceshop.com',
    searchParam: 's',
    extraParams: 'post_type=product'
  },
  {
    name: 'FragranceBuy',
    baseUrl: 'https://fragrancebuy.ca',
    searchUrl: 'https://fragrancebuy.ca/search',
    searchParam: 'q'
  },
  {
    name: 'AuraFragrance',
    baseUrl: 'https://www.aurafragrance.com', 
    searchUrl: 'https://www.aurafragrance.com/search',
    searchParam: 'q'
  },
  {
    name: 'FragFlex',
    baseUrl: 'https://fragflex.com',
    searchUrl: 'https://fragflex.com/search',
    searchParam: 'q'
  },
  {
    name: 'Jomashop',
    baseUrl: 'https://www.jomashop.com',
    searchUrl: 'https://www.jomashop.com/search',
    searchParam: 'q'
  }
];

async function scrapeWebsite(config: any, query: string): Promise<PerfumeResult> {
  try {
    // Build search URL
    let searchUrl = `${config.searchUrl}?${config.searchParam}=${encodeURIComponent(query)}`;
    if (config.extraParams) {
      searchUrl += `&${config.extraParams}`;
    }

    console.log(`Scraping ${config.name}: ${searchUrl}`);

    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // Basic HTML parsing logic (would need to be customized per site)
    const result = parseHTML(html, config);
    
    return {
      website: config.name,
      productName: result.productName || 'Product not found',
      productPrice: result.productPrice || 'N/A',
      productLink: result.productLink || searchUrl,
      productImage: result.productImage || '',
      inStock: result.inStock !== false
    };

  } catch (error) {
    console.error(`Error scraping ${config.name}:`, error);
    return {
      website: config.name,
      productName: 'Error occurred',
      productPrice: 'N/A',
      productLink: '',
      productImage: '',
      inStock: false,
      error: error.message
    };
  }
}

function parseHTML(html: string, config: any) {
  // This is a simplified parser - in production you'd use a proper HTML parser
  // and customize selectors for each website
  
  const result = {
    productName: '',
    productPrice: '',
    productLink: '',
    productImage: '',
    inStock: true
  };

  try {
    // Look for common price patterns
    const priceRegex = /\$[\d,]+\.?\d*/g;
    const priceMatches = html.match(priceRegex);
    if (priceMatches && priceMatches.length > 0) {
      result.productPrice = priceMatches[0];
    }

    // Look for product names (this would need site-specific customization)
    const titleRegex = /<title[^>]*>([^<]+)</i;
    const titleMatch = html.match(titleRegex);
    if (titleMatch) {
      result.productName = titleMatch[1].trim();
    }

    // Look for product images
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const imgMatches = html.match(imgRegex);
    if (imgMatches && imgMatches.length > 0) {
      const srcMatch = imgMatches[0].match(/src=["']([^"']+)["']/);
      if (srcMatch) {
        result.productImage = srcMatch[1];
        // Make sure it's a full URL
        if (result.productImage.startsWith('/')) {
          result.productImage = config.baseUrl + result.productImage;
        }
      }
    }

  } catch (error) {
    console.error('HTML parsing error:', error);
  }

  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q') || url.searchParams.get('query');

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter "q" is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log(`Searching for: ${query}`);

    // Update search analytics
    try {
      const { data: existingQuery } = await supabase
        .from('search_queries')
        .select('*')
        .eq('query', query.toLowerCase())
        .single();

      if (existingQuery) {
        await supabase
          .from('search_queries')
          .update({ 
            search_count: existingQuery.search_count + 1,
            last_searched_at: new Date().toISOString()
          })
          .eq('id', existingQuery.id);
      } else {
        await supabase
          .from('search_queries')
          .insert({ 
            query: query.toLowerCase(),
            search_count: 1
          });
      }
    } catch (analyticsError) {
      console.error('Analytics update error:', analyticsError);
    }

    // Scrape all websites concurrently
    const scrapePromises = scraperConfigs.map(config => 
      scrapeWebsite(config, query)
    );

    const results = await Promise.all(scrapePromises);

    // Find the best deal (lowest price)
    const validResults = results.filter(r => r.productPrice !== 'N/A' && !r.error);
    let bestDeal = null;

    if (validResults.length > 0) {
      bestDeal = validResults.reduce((best, current) => {
        const bestPrice = parseFloat(best.productPrice.replace(/[^0-9.]/g, ''));
        const currentPrice = parseFloat(current.productPrice.replace(/[^0-9.]/g, ''));
        return currentPrice < bestPrice ? current : best;
      });
    }

    const response = {
      query,
      results,
      bestDeal,
      totalResults: results.length,
      validResults: validResults.length,
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});