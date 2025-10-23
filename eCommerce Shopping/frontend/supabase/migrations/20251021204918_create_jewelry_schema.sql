/*
  # Jewelry eCommerce Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text) - Category name (Rings, Necklaces, Earrings, etc.)
      - `slug` (text, unique) - URL-friendly identifier
      - `description` (text) - Category description
      - `image_url` (text) - Category image
      - `created_at` (timestamptz)
    
    - `collections`
      - `id` (uuid, primary key)
      - `name` (text) - Collection name (e.g., "Spring 2024", "Heritage")
      - `slug` (text, unique)
      - `description` (text)
      - `image_url` (text)
      - `featured` (boolean) - Whether to show on homepage
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `slug` (text, unique)
      - `description` (text)
      - `price` (numeric) - Price in dollars
      - `category_id` (uuid, foreign key)
      - `collection_id` (uuid, foreign key, nullable)
      - `images` (jsonb) - Array of image URLs
      - `materials` (text[]) - Array of materials (gold, silver, diamond, etc.)
      - `in_stock` (boolean)
      - `featured` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (eCommerce site)
    - Products are publicly viewable without authentication
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  category_id uuid REFERENCES categories(id),
  collection_id uuid REFERENCES collections(id),
  images jsonb DEFAULT '[]'::jsonb,
  materials text[] DEFAULT ARRAY[]::text[],
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view collections"
  ON collections FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- Insert sample data
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Rings', 'rings', 'Exquisite rings crafted with precision', 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg'),
  ('Necklaces', 'necklaces', 'Elegant necklaces for every occasion', 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg'),
  ('Earrings', 'earrings', 'Stunning earrings that captivate', 'https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg'),
  ('Bracelets', 'bracelets', 'Timeless bracelets of distinction', 'https://images.pexels.com/photos/1472443/pexels-photo-1472443.jpeg')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO collections (name, slug, description, featured, image_url) VALUES
  ('Noir Collection', 'noir', 'Mysterious elegance in black diamonds and dark metals', true, 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg'),
  ('Eternal Shine', 'eternal-shine', 'Classic pieces that transcend time', true, 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, category_id, collection_id, images, materials, featured, in_stock)
SELECT 
  'Midnight Diamond Ring',
  'midnight-diamond-ring',
  'A stunning black diamond set in 18k white gold, embodying sophistication and mystery.',
  2499.00,
  c.id,
  col.id,
  '["https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg", "https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg"]'::jsonb,
  ARRAY['18k White Gold', 'Black Diamond'],
  true,
  true
FROM categories c, collections col
WHERE c.slug = 'rings' AND col.slug = 'noir'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, category_id, images, materials, featured, in_stock)
SELECT 
  'Obsidian Tear Necklace',
  'obsidian-tear-necklace',
  'An elegant pendant featuring a teardrop obsidian stone in a platinum setting.',
  1899.00,
  c.id,
  '["https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg", "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"]'::jsonb,
  ARRAY['Platinum', 'Obsidian'],
  true,
  true
FROM categories c
WHERE c.slug = 'necklaces'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, category_id, images, materials, featured, in_stock)
SELECT 
  'Shadow Pearl Earrings',
  'shadow-pearl-earrings',
  'Tahitian black pearls suspended in hand-crafted silver settings.',
  1299.00,
  c.id,
  '["https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg"]'::jsonb,
  ARRAY['Sterling Silver', 'Tahitian Pearl'],
  true,
  true
FROM categories c
WHERE c.slug = 'earrings'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, category_id, images, materials, in_stock)
SELECT 
  'Onyx Link Bracelet',
  'onyx-link-bracelet',
  'Bold yet refined, featuring alternating onyx stones and white gold links.',
  1599.00,
  c.id,
  '["https://images.pexels.com/photos/1472443/pexels-photo-1472443.jpeg"]'::jsonb,
  ARRAY['18k White Gold', 'Onyx'],
  true
FROM categories c
WHERE c.slug = 'bracelets'
ON CONFLICT (slug) DO NOTHING;