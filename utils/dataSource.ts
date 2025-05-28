import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

// Product interface matching our mapped Amazon data structure
export interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  brand: string;
  category: string;
  tags: string[];
  discountedPrice?: string;
  rating?: string;
  gender?: 'Men' | 'Women' | 'Unisex';
  description?: string;
  reviewCount?: string;
}

// Storage for parsed products
let AMAZON_PRODUCTS: Product[] = [];

// Function to parse category string into array of subcategories
const parseCategoryString = (categoryStr: string): string[] => {
  if (!categoryStr) return [];
  return categoryStr.split('|');
};

// Function to extract tags from categories and about product
const extractTags = (categoryStr: string, aboutProduct: string): string[] => {
  const tags = new Set<string>();
  
  // Extract from categories
  const categories = parseCategoryString(categoryStr);
  categories.forEach(category => {
    // Extract last part of category path as a tag
    const parts = category.split('&');
    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1].trim().toLowerCase();
      if (lastPart && lastPart !== 'clothing') {
        tags.add(lastPart);
      }
    }
  });
  
  // Extract keywords from about product (first 3 words that are at least 4 chars)
  if (aboutProduct) {
    const words = aboutProduct.split(/[\s,.]+/);
    let count = 0;
    words.forEach(word => {
      if (count < 3 && word.length > 3) {
        tags.add(word.toLowerCase());
        count++;
      }
    });
  }
  
  return Array.from(tags);
};

// Function to determine gender from category or product name
const determineGender = (categoryStr: string, productName: string): 'Men' | 'Women' | 'Unisex' => {
  const lowerCat = categoryStr.toLowerCase();
  const lowerName = productName.toLowerCase();
  
  if (lowerCat.includes('women') || lowerName.includes('women') || 
      lowerName.includes('ladies') || lowerName.includes('girl')) {
    return 'Women';
  } else if (lowerCat.includes('men') || lowerName.includes('men') || 
             lowerName.includes('boy')) {
    return 'Men';
  }
  
  return 'Unisex';
};

// Function to extract brand from product name
const extractBrand = (productName: string): string => {
  // Take first word of product name as brand if more than 2 characters
  const firstWord = productName.split(' ')[0];
  if (firstWord && firstWord.length > 2) {
    return firstWord;
  }
  return 'Unknown Brand';
};

// Function to map Amazon product to our Product interface
const mapAmazonProduct = (amazonProduct: any): Product => {
  const category = determineMainCategory(amazonProduct.category);
  const tags = extractTags(amazonProduct.category, amazonProduct.about_product);
  const gender = determineGender(amazonProduct.category, amazonProduct.product_name);
  const brand = extractBrand(amazonProduct.product_name);
  
  return {
    id: amazonProduct.product_id,
    title: amazonProduct.product_name,
    price: amazonProduct.actual_price,
    discountedPrice: amazonProduct.discounted_price,
    imageUrl: amazonProduct.img_link,
    brand: brand,
    category: category,
    tags: tags,
    rating: amazonProduct.rating,
    reviewCount: amazonProduct.rating_count,
    gender: gender,
    description: amazonProduct.about_product
  };
};

// Function to determine main category from category string
const determineMainCategory = (categoryStr: string): string => {
  if (!categoryStr) return 'Other';
  
  const categories = parseCategoryString(categoryStr);
  
  // Common clothing categories to map to our simplified structure
  const mappings: {[key: string]: string} = {
    'tshirt': 'Tops',
    't-shirt': 'Tops',
    'shirt': 'Tops',
    'top': 'Tops',
    'blouse': 'Tops',
    'jeans': 'Bottoms',
    'pants': 'Bottoms',
    'trousers': 'Bottoms',
    'shorts': 'Bottoms',
    'skirt': 'Bottoms',
    'dress': 'Dresses',
    'jacket': 'Jackets',
    'coat': 'Jackets',
    'hoodie': 'Outerwear',
    'sweater': 'Outerwear',
    'shoes': 'Shoes',
    'sneakers': 'Shoes',
    'boots': 'Shoes',
    'accessories': 'Accessories',
    'jewelry': 'Accessories',
    'hat': 'Accessories',
    'bag': 'Accessories',
    'watch': 'Accessories',
    'ethnic': 'Ethnic',
    'kurta': 'Ethnic',
    'saree': 'Ethnic'
  };
  
  // Check each category string for matches
  for (const category of categories) {
    const lowerCat = category.toLowerCase();
    for (const [key, value] of Object.entries(mappings)) {
      if (lowerCat.includes(key)) {
        return value;
      }
    }
  }
  
  // If no specific match, check if it's generally clothing
  const lowerCats = categoryStr.toLowerCase();
  if (lowerCats.includes('cloth') || lowerCats.includes('apparel') || 
      lowerCats.includes('fashion') || lowerCats.includes('wear')) {
    return 'Other Clothing';
  }
  
  return 'Other';
};

// Function to check if a product is clothing
const isClothingProduct = (categoryStr: string): boolean => {
  if (!categoryStr) return false;
  
  const lowerCat = categoryStr.toLowerCase();
  return lowerCat.includes('cloth') || 
         lowerCat.includes('apparel') || 
         lowerCat.includes('fashion') || 
         lowerCat.includes('wear') ||
         lowerCat.includes('shirt') ||
         lowerCat.includes('dress') ||
         lowerCat.includes('pant') ||
         lowerCat.includes('jean') ||
         lowerCat.includes('skirt') ||
         lowerCat.includes('shoe') ||
         lowerCat.includes('boot') ||
         lowerCat.includes('jacket') ||
         lowerCat.includes('coat');
};

// Function to load and parse the Amazon dataset
export const loadAmazonProducts = async (): Promise<void> => {
  try {
    // Skip trying to load from CSV or cache
    // Always use the fallback products with reliable images
    console.log('Using fallback products with reliable images');
    AMAZON_PRODUCTS = [];
    
    // This will force the app to use FALLBACK_PRODUCTS everywhere
  } catch (error) {
    console.error('Error loading Amazon products:', error);
    // Fallback to empty array
    AMAZON_PRODUCTS = [];
  }
};

// Fallback products in case loading fails
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1001',
    title: 'Slim Fit Cotton T-Shirt',
    price: '₹999',
    discountedPrice: '₹599',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
    brand: 'H&M',
    category: 'Tops',
    tags: ['cotton', 'casual', 'slim-fit'],
    rating: '4.2',
    gender: 'Men',
    reviewCount: '1245'
  },
  {
    id: '1002',
    title: 'Skinny Fit Jeans',
    price: '₹1599',
    discountedPrice: '₹1199',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop',
    brand: 'Levis',
    category: 'Bottoms',
    tags: ['denim', 'skinny', 'jeans'],
    rating: '4.5',
    gender: 'Men',
    reviewCount: '2341'
  },
  {
    id: '1003',
    title: 'Floral Print Maxi Dress',
    price: '₹2499',
    discountedPrice: '₹1799',
    imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop',
    brand: 'Zara',
    category: 'Dresses',
    tags: ['floral', 'maxi', 'summer'],
    rating: '4.3',
    gender: 'Women',
    reviewCount: '856'
  },
  
  {
    id: '1004',
    title: 'Printed Summer Dress',
    price: '₹1999',
    discountedPrice: '₹999',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
    brand: 'H&M',
    category: 'Dresses',
    tags: ['summer', 'printed', 'casual'],
    rating: '4.0',
    gender: 'Women',
    reviewCount: '428'
  },
  {
    id: '1010',
    title: 'Women\'s Formal Blazer',
    price: '₹3499',
    discountedPrice: '₹1599',
    imageUrl: 'https://images.unsplash.com/photo-1551734444-c6c284a6a20d?q=80&w=1000&auto=format&fit=crop',
    brand: 'Mango',
    category: 'Jackets',
    tags: ['formal', 'office', 'blazer'],
    rating: '4.4',
    gender: 'Women',
    reviewCount: '543'
  },
  {
    id: '1005',
    title: 'Unisex Cotton Hoodie',
    price: '₹1799',
    discountedPrice: '₹799',
    imageUrl: 'https://images.unsplash.com/photo-1556172252-2bc194ca4e78?q=80&w=1000&auto=format&fit=crop',
    brand: 'Nike',
    category: 'Outerwear',
    tags: ['cotton', 'hoodie', 'casual'],
    rating: '4.5',
    gender: 'Unisex',
    reviewCount: '1876'
  },
  {
    id: '1006',
    title: 'Women\'s Pleated Skirt',
    price: '₹1499',
    discountedPrice: '₹699',
    imageUrl: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=1000&auto=format&fit=crop',
    brand: 'Forever 21',
    category: 'Bottoms',
    tags: ['pleated', 'skirt', 'elegant'],
    rating: '4.2',
    gender: 'Women',
    reviewCount: '765'
  },
  {
    id: '1007',
    title: 'Men\'s Formal Shirt',
    price: '₹1899',
    discountedPrice: '₹899',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1000&auto=format&fit=crop',
    brand: 'Arrow',
    category: 'Tops',
    tags: ['formal', 'cotton', 'shirt'],
    rating: '4.3',
    gender: 'Men',
    reviewCount: '1432'
  },
  {
    id: '1008',
    title: 'Women\'s Running Shoes',
    price: '₹2999',
    discountedPrice: '₹1399',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
    brand: 'Adidas',
    category: 'Shoes',
    tags: ['running', 'sports', 'breathable'],
    rating: '4.4',
    gender: 'Women',
    reviewCount: '987'
  },
  {
    id: '1009',
    title: 'Denim Jacket',
    price: '₹2499',
    discountedPrice: '₹1699',
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop',
    brand: 'Pepe Jeans',
    category: 'Jackets',
    tags: ['denim', 'casual', 'jacket'],
    rating: '4.1',
    gender: 'Unisex',
    reviewCount: '653'
  },
];

// Extract all unique categories from products and count products in each
export const getCategories = (): { name: string, count: number }[] => {
  const products = AMAZON_PRODUCTS.length > 0 ? AMAZON_PRODUCTS : FALLBACK_PRODUCTS;
  
  return [
    { name: 'All', count: products.length },
    ...Array.from(
      new Set(products.map(product => product.category))
    ).map(category => ({
      name: category,
      count: products.filter(product => product.category === category).length
    }))
  ];
};

// Extract all unique tags from products
export const getTags = (): string[] => {
  const products = AMAZON_PRODUCTS.length > 0 ? AMAZON_PRODUCTS : FALLBACK_PRODUCTS;
  
  return Array.from(
    new Set(products.flatMap(product => product.tags))
  ).sort();
};

// Functions for managing data

// Get all products
export const getAllProducts = (): Product[] => {
  return AMAZON_PRODUCTS.length > 0 ? AMAZON_PRODUCTS : FALLBACK_PRODUCTS;
};

// Get products by category
export const getProductsByCategory = (categoryName: string): Product[] => {
  const products = AMAZON_PRODUCTS.length > 0 ? AMAZON_PRODUCTS : FALLBACK_PRODUCTS;
  
  if (categoryName === 'All') {
    return products;
  }
  return products.filter(product => product.category === categoryName);
};

// Search products by query (searches in title, brand, category, and tags)
export const searchProducts = (query: string): Product[] => {
  const products = AMAZON_PRODUCTS.length > 0 ? AMAZON_PRODUCTS : FALLBACK_PRODUCTS;
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  return products.filter(product => {
    const searchableText = 
      `${product.title} ${product.brand} ${product.category} ${product.tags.join(' ')}`.toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  });
};

// Get products by tag
export const getProductsByTag = (tag: string): Product[] => {
  const products = AMAZON_PRODUCTS.length > 0 ? AMAZON_PRODUCTS : FALLBACK_PRODUCTS;
  
  return products.filter(product => 
    product.tags.some(productTag => productTag === tag)
  );
};

// Load products when module is imported
loadAmazonProducts().catch(console.error);

// First-time user storage functions
export const hasVisitedHaulScreen = async (): Promise<boolean> => {
  try {
    const visited = await AsyncStorage.getItem('hasVisitedHaulScreen');
    return visited === 'true';
  } catch (error) {
    console.error('Error checking HaulScreen visit status:', error);
    return false;
  }
};

export const recordHaulScreenVisit = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem('hasVisitedHaulScreen', 'true');
  } catch (error) {
    console.error('Error recording HaulScreen visit:', error);
  }
}; 