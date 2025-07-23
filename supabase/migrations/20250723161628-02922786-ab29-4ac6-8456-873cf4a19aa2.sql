-- Create fragrances table to store fragrance information
CREATE TABLE public.fragrances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create retailers table to store retailer information
CREATE TABLE public.retailers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  base_url TEXT NOT NULL,
  search_url_template TEXT NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create price_history table to track price changes
CREATE TABLE public.price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fragrance_id UUID REFERENCES public.fragrances(id) ON DELETE CASCADE,
  retailer_id UUID REFERENCES public.retailers(id) ON DELETE CASCADE,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  product_url TEXT,
  product_name TEXT,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create search_queries table to track user searches
CREATE TABLE public.search_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  search_count INTEGER DEFAULT 1,
  last_searched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.fragrances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for price comparison)
CREATE POLICY "Allow public read access to fragrances" 
ON public.fragrances FOR SELECT USING (true);

CREATE POLICY "Allow public read access to retailers" 
ON public.retailers FOR SELECT USING (true);

CREATE POLICY "Allow public read access to price_history" 
ON public.price_history FOR SELECT USING (true);

CREATE POLICY "Allow public read access to search_queries" 
ON public.search_queries FOR SELECT USING (true);

CREATE POLICY "Allow public insert to search_queries" 
ON public.search_queries FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to search_queries" 
ON public.search_queries FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_price_history_fragrance_id ON public.price_history(fragrance_id);
CREATE INDEX idx_price_history_retailer_id ON public.price_history(retailer_id);
CREATE INDEX idx_price_history_scraped_at ON public.price_history(scraped_at DESC);
CREATE INDEX idx_search_queries_query ON public.search_queries(query);
CREATE INDEX idx_search_queries_search_count ON public.search_queries(search_count DESC);

-- Insert retailer data
INSERT INTO public.retailers (name, base_url, search_url_template, logo_url) VALUES 
('FragranceNet', 'https://www.fragrancenet.com', 'https://www.fragrancenet.com/search?q={query}', NULL),
('FragranceX', 'https://www.fragrancex.com', 'https://www.fragrancex.com/search?q={query}', NULL),
('FragranceShop', 'https://www.fragranceshop.com', 'https://www.fragranceshop.com/?post_type=product&s={query}', NULL),
('FragranceBuy', 'https://fragrancebuy.ca', 'https://fragrancebuy.ca/search?q={query}', NULL),
('AuraFragrance', 'https://www.aurafragrance.com', 'https://www.aurafragrance.com/search?q={query}', NULL),
('FragFlex', 'https://fragflex.com', 'https://fragflex.com/search?q={query}', NULL),
('Jomashop', 'https://www.jomashop.com', 'https://www.jomashop.com/search?q={query}', NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_fragrances_updated_at
  BEFORE UPDATE ON public.fragrances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();