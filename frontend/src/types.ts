export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id?: string;
  collection_id?: string | null;
  images: string[];
  materials: string[];
  in_stock: boolean;
  featured?: boolean;
  created_at?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
}
