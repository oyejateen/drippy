import AsyncStorage from '@react-native-async-storage/async-storage';

// Walmart Product interface
export interface WalmartProduct {
  id: string;
  title: string;
  price: string;
  finalPrice: string;
  imageUrl: string;
  brand: string;
  category: string;
  categories: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  description: string;
  url: string;
  availableForDelivery: boolean;
  availableForPickup: boolean;
  discount?: string;
  initialPrice?: string;
  unitPrice?: string;
  unit?: string;
  sizes?: string[];
  colors?: string[];
  specifications?: any[];
  customerReviews?: any[];
  ingredients?: string;
  mainImage?: string;
  imageUrls?: string[];
}

// Storage for parsed products
let WALMART_PRODUCTS: WalmartProduct[] = [];



// Function to load Walmart products
export const loadWalmartProducts = async (): Promise<void> => {
  try {
    console.log('Loading Walmart products...');
    
    // Check if we have cached data
    const cachedData = await AsyncStorage.getItem('walmart_products_cache');
    if (cachedData) {
      WALMART_PRODUCTS = JSON.parse(cachedData);
      console.log(`Loaded ${WALMART_PRODUCTS.length} products from cache`);
      return;
    }

    // Use hardcoded products
    console.log('Loading hardcoded Walmart products');
    WALMART_PRODUCTS = WALMART_PRODUCTS_DATA;
    
    // Cache the data
    await AsyncStorage.setItem('walmart_products_cache', JSON.stringify(WALMART_PRODUCTS_DATA));
    
    console.log(`Loaded ${WALMART_PRODUCTS_DATA.length} Walmart products`);
  } catch (error) {
    console.error('Error loading Walmart products:', error);
    // Use hardcoded products as fallback
    WALMART_PRODUCTS = WALMART_PRODUCTS_DATA;
  }
};

// Walmart products data
const WALMART_PRODUCTS_DATA: WalmartProduct[] = [
  // BEAUTY PRODUCTS (15 items)
  {
    id: 'beauty_001',
    title: 'Laura Mercier Caviar Stick Eye Color Sugar Frost',
    price: '$29.00',
    finalPrice: '$26.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Laura-Mercier-Caviar-Stick-Eye-Color-Sugar-Frost-1-64g-0-05oz_55297223-7af5-4a30-83c2-4d74d08969e3.8ca12dd7578ff564b6e01923e85ffd11.jpeg',
    brand: 'Laura Mercier',
    category: 'Beauty',
    categories: ['Beauty', 'Makeup', 'Eye Makeup', 'Eye Shadow'],
    tags: ['Eye Shadow', 'Stick', 'Frost', 'Luxury'],
    rating: 4.0,
    reviewCount: 6,
    description: 'Laura Mercier Caviar Stick Eye Color glides seamlessly onto lids.',
    url: 'https://www.walmart.com/ip/Laura-Mercier-Caviar-Stick-Eye-Color-Sugar-Frost/173530386',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    colors: ['Sugar Frost', 'Tuxedo'],
    specifications: [{ name: 'Brand', value: 'Laura Mercier' }]
  },
  {
    id: 'beauty_002',
    title: 'Maybelline Sky High Washable Mascara',
    price: '$12.99',
    finalPrice: '$9.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71MQo8pHmBL.jpg',
    brand: 'Maybelline',
    category: 'Beauty',
    categories: ['Beauty', 'Makeup', 'Eye Makeup', 'Mascara'],
    tags: ['Mascara', 'Lengthening', 'Washable', 'Black'],
    rating: 4.5,
    reviewCount: 1250,
    description: 'Sky High mascara gives you limitless lash length and volume.',
    url: 'https://www.walmart.com/ip/Maybelline-Sky-High-Mascara/123456789',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Very Black', 'Brownish Black'],
    specifications: [{ name: 'Brand', value: 'Maybelline' }]
  },
  {
    id: 'beauty_003',
    title: 'L\'Oreal Paris True Match Lumi Foundation',
    price: '$14.99',
    finalPrice: '$11.99',
    imageUrl: 'https://m.media-amazon.com/images/I/31RVlIqxOfL._AC_.jpg',
    brand: 'L\'Oreal Paris',
    category: 'Beauty',
    categories: ['Beauty', 'Makeup', 'Face Makeup', 'Foundation'],
    tags: ['Foundation', 'Luminous', 'Natural', 'Radiant'],
    rating: 4.3,
    reviewCount: 890,
    description: 'True Match Lumi Foundation provides natural, radiant coverage.',
    url: 'https://www.walmart.com/ip/L-Oreal-True-Match-Lumi-Foundation/987654321',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Natural Ivory', 'Natural Buff', 'Natural Beige'],
    specifications: [{ name: 'Brand', value: 'L\'Oreal Paris' }]
  },
  {
    id: 'beauty_004',
    title: 'Revlon ColorStay Lipstick',
    price: '$8.99',
    finalPrice: '$6.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71EhhSgw09L._UF1000,1000_QL80_.jpg',
    brand: 'Revlon',
    category: 'Beauty',
    categories: ['Beauty', 'Makeup', 'Lip Makeup', 'Lipstick'],
    tags: ['Lipstick', 'Long-wearing', 'Creamy', 'Color'],
    rating: 4.2,
    reviewCount: 567,
    description: 'ColorStay lipstick provides long-wearing, creamy color.',
    url: 'https://www.walmart.com/ip/Revlon-ColorStay-Lipstick/456789123',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Red', 'Pink', 'Nude', 'Berry'],
    specifications: [{ name: 'Brand', value: 'Revlon' }]
  },
  {
    id: 'beauty_005',
    title: 'Neutrogena Ultra Sheer Dry-Touch Sunscreen',
    price: '$15.99',
    finalPrice: '$12.99',
    imageUrl: 'https://m.media-amazon.com/images/I/41P7P+PCx-L._UF1000,1000_QL80_.jpg',
    brand: 'Neutrogena',
    category: 'Beauty',
    categories: ['Beauty', 'Skincare', 'Sunscreen'],
    tags: ['Sunscreen', 'SPF', 'Dry-touch', 'Oil-free'],
    rating: 4.7,
    reviewCount: 2340,
    description: 'Ultra Sheer Dry-Touch sunscreen provides broad spectrum protection.',
    url: 'https://www.walmart.com/ip/Neutrogena-Ultra-Sheer-Sunscreen/789123456',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Clear'],
    specifications: [{ name: 'Brand', value: 'Neutrogena' }]
  },
  {
    id: 'beauty_006',
    title: 'CeraVe Moisturizing Cream',
    price: '$19.99',
    finalPrice: '$16.99',
    imageUrl: 'https://m.media-amazon.com/images/I/6147cwOvHBL.jpg',
    brand: 'CeraVe',
    category: 'Beauty',
    categories: ['Beauty', 'Skincare', 'Moisturizer'],
    tags: ['Moisturizer', 'Ceramides', 'Hyaluronic Acid', 'Fragrance-free'],
    rating: 4.8,
    reviewCount: 3450,
    description: 'CeraVe Moisturizing Cream with ceramides and hyaluronic acid.',
    url: 'https://www.walmart.com/ip/CeraVe-Moisturizing-Cream/321654987',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['White'],
    specifications: [{ name: 'Brand', value: 'CeraVe' }]
  },
  {
    id: 'beauty_007',
    title: 'The Ordinary Niacinamide 10% + Zinc 1%',
    price: '$12.99',
    finalPrice: '$9.99',
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/54d4717de4b0950984a1ad2f/1549383988780-LPIF231QTWKG6TLG1MMR/The-Ordinary-Niacinamide-2.jpg',
    brand: 'The Ordinary',
    category: 'Beauty',
    categories: ['Beauty', 'Skincare', 'Serum'],
    tags: ['Serum', 'Niacinamide', 'Zinc', 'Oil Control'],
    rating: 4.6,
    reviewCount: 1890,
    description: 'Niacinamide 10% + Zinc 1% for blemish and oil control.',
    url: 'https://www.walmart.com/ip/The-Ordinary-Niacinamide-Serum/654321987',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Clear'],
    specifications: [{ name: 'Brand', value: 'The Ordinary' }]
  },
  {
    id: 'beauty_008',
    title: 'Urban Decay Naked3 Eyeshadow Palette',
    price: '$54.00',
    finalPrice: '$44.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61s-7j61tSL._UF1000,1000_QL80_.jpg',
    brand: 'Urban Decay',
    category: 'Beauty',
    categories: ['Beauty', 'Makeup', 'Eye Makeup', 'Eyeshadow'],
    tags: ['Eyeshadow', 'Palette', 'Rose Gold', 'Naked'],
    rating: 4.4,
    reviewCount: 756,
    description: 'Naked3 palette with 12 rose-hued neutrals.',
    url: 'https://www.walmart.com/ip/Urban-Decay-Naked3-Palette/987654321',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    colors: ['Rose Gold'],
    specifications: [{ name: 'Brand', value: 'Urban Decay' }]
  },
  {
    id: 'beauty_009',
    title: 'Benefit Hoola Bronzer',
    price: '$32.00',
    finalPrice: '$28.99',
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/tr:h-800,w-800,cm-pad_resize/8/e/8e79020602004138620_1.jpg',
    brand: 'Benefit',
    category: 'Beauty',
    categories: ['Beauty', 'Makeup', 'Face Makeup', 'Bronzer'],
    tags: ['Bronzer', 'Matte', 'Natural', 'Hoola'],
    rating: 4.5,
    reviewCount: 432,
    description: 'Hoola bronzer for a natural, matte finish.',
    url: 'https://www.walmart.com/ip/Benefit-Hoola-Bronzer/123789456',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    colors: ['Hoola'],
    specifications: [{ name: 'Brand', value: 'Benefit' }]
  },
  {
    id: 'beauty_010',
    title: 'MAC Ruby Woo Lipstick',
    price: '$19.00',
    finalPrice: '$16.99',
    imageUrl: 'https://images-cdn.ubuy.co.in/63f59b3b3d61925b4f3b1da6-mac-retro-matte-lipstick-rub-ruby-woo.jpg',
    brand: 'MAC',
    category: 'Beauty',
    categories: ['Beauty', 'Makeup', 'Lip Makeup', 'Lipstick'],
    tags: ['Lipstick', 'Ruby Woo', 'Retro Matte', 'Red'],
    rating: 4.7,
    reviewCount: 890,
    description: 'Ruby Woo lipstick with retro matte finish.',
    url: 'https://www.walmart.com/ip/MAC-Ruby-Woo-Lipstick/456123789',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    colors: ['Ruby Woo'],
    specifications: [{ name: 'Brand', value: 'MAC' }]
  },
  {
    id: 'beauty_011',
    title: 'Clinique Dramatically Different Moisturizing Lotion+',
    price: '$29.00',
    finalPrice: '$24.99',
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/e/5/e5afe8120714598938_1.jpg?tr=w-500',
    brand: 'Clinique',
    category: 'Beauty',
    categories: ['Beauty', 'Skincare', 'Moisturizer'],
    tags: ['Moisturizer', 'Clinique', 'Dramatically Different', 'Gentle'],
    rating: 4.3,
    reviewCount: 1234,
    description: 'Dramatically Different moisturizing lotion for all skin types.',
    url: 'https://www.walmart.com/ip/Clinique-Moisturizing-Lotion/789456123',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Yellow'],
    specifications: [{ name: 'Brand', value: 'Clinique' }]
  },
  {
    id: 'beauty_012',
    title: 'Anastasia Beverly Hills Brow Wiz',
    price: '$23.00',
    finalPrice: '$19.99',
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/f/5/f530dd8ANAST00000069_1.jpg',
    brand: 'Anastasia Beverly Hills',
    category: 'Beauty',
    categories: ['Beauty', 'Makeup', 'Eye Makeup', 'Brow'],
    tags: ['Brow', 'Pencil', 'Micro', 'Precise'],
    rating: 4.6,
    reviewCount: 678,
    description: 'Brow Wiz micro pencil for precise brow definition.',
    url: 'https://www.walmart.com/ip/Anastasia-Brow-Wiz/321789456',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    colors: ['Medium Brown', 'Dark Brown', 'Blonde'],
    specifications: [{ name: 'Brand', value: 'Anastasia Beverly Hills' }]
  },
  {
    id: 'beauty_013',
    title: 'Tarte Shape Tape Concealer',
    price: '$27.00',
    finalPrice: '$24.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61kCMnBiEsL._UF1000,1000_QL80_.jpg',
    brand: 'Tarte',
    category: 'Beauty',
    categories: ['Beauty', 'Makeup', 'Face Makeup', 'Concealer'],
    tags: ['Concealer', 'Full Coverage', 'Shape Tape', 'Creamy'],
    rating: 4.8,
    reviewCount: 2340,
    description: 'Shape Tape concealer with full coverage and creamy texture.',
    url: 'https://www.walmart.com/ip/Tarte-Shape-Tape-Concealer/654789123',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    colors: ['Light', 'Light-Medium', 'Medium', 'Medium-Tan'],
    specifications: [{ name: 'Brand', value: 'Tarte' }]
  },
  {
    id: 'beauty_014',
    title: 'Fenty Beauty Pro Filt\'r Soft Matte Longwear Foundation',
    price: '$36.00',
    finalPrice: '$32.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61JLUcAb+9L._UF1000,1000_QL80_.jpg',
    brand: 'Fenty Beauty',
    category: 'Beauty',
    categories: ['Beauty', 'Makeup', 'Face Makeup', 'Foundation'],
    tags: ['Foundation', 'Soft Matte', 'Longwear', 'Fenty'],
    rating: 4.4,
    reviewCount: 1567,
    description: 'Pro Filt\'r soft matte longwear foundation.',
    url: 'https://www.walmart.com/ip/Fenty-Beauty-Pro-Filt-r-Foundation/987123456',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    colors: ['100', '110', '120', '130', '140', '150'],
    specifications: [{ name: 'Brand', value: 'Fenty Beauty' }]
  },
  // CLOTHING PRODUCTS (15 items)
  {
    id: 'clothing_001',
    title: 'Nike Dri-FIT Training T-Shirt',
    price: '$35.00',
    finalPrice: '$29.99',
    imageUrl: 'https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/3d87886d-00ed-44d0-af69-698535fa3d08/AS+M+NK+DF+TEE+CAMO+GFX.png',
    brand: 'Nike',
    category: 'Clothing',
    categories: ['Clothing', 'Athletic', 'Tops', 'T-Shirts'],
    tags: ['Athletic', 'Dri-FIT', 'Training', 'Moisture-wicking'],
    rating: 4.6,
    reviewCount: 890,
    description: 'Nike Dri-FIT training t-shirt with moisture-wicking technology.',
    url: 'https://www.walmart.com/ip/Nike-Dri-FIT-Training-T-Shirt/123456789',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Gray', 'Navy', 'Red'],
    specifications: [{ name: 'Brand', value: 'Nike' }]
  },
  {
    id: 'clothing_002',
    title: 'Levi\'s 501 Original Fit Jeans',
    price: '$69.50',
    finalPrice: '$59.99',
    imageUrl: 'https://m.media-amazon.com/images/I/51bITyn5kQL._UY1100_.jpg',
    brand: 'Levi\'s',
    category: 'Clothing',
    categories: ['Clothing', 'Bottoms', 'Jeans', 'Denim'],
    tags: ['Jeans', 'Denim', 'Classic', '501'],
    rating: 4.4,
    reviewCount: 1234,
    description: 'Levi\'s 501 original fit jeans in classic denim.',
    url: 'https://www.walmart.com/ip/Levis-501-Jeans/987654321',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['30x32', '32x32', '34x32', '36x32', '38x32'],
    colors: ['Blue', 'Dark Blue', 'Black'],
    specifications: [{ name: 'Brand', value: 'Levi\'s' }]
  },
  {
    id: 'clothing_003',
    title: 'Adidas Ultraboost 21 Running Shoes',
    price: '$180.00',
    finalPrice: '$149.99',
    imageUrl: 'https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/13444554/2021/2/22/4a58c1b9-82fe-47ae-a414-b24f3bf809311613987577735-ADIDAS-Men-Sports-Shoes-2701613987577079-1.jpg',
    brand: 'Adidas',
    category: 'Clothing',
    categories: ['Clothing', 'Footwear', 'Athletic Shoes', 'Running'],
    tags: ['Running', 'Ultraboost', 'Athletic', 'Comfortable'],
    rating: 4.7,
    reviewCount: 567,
    description: 'Adidas Ultraboost 21 running shoes with responsive cushioning.',
    url: 'https://www.walmart.com/ip/Adidas-Ultraboost-21/456789123',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black/White', 'Blue/White', 'Gray/White'],
    specifications: [{ name: 'Brand', value: 'Adidas' }]
  },
  {
    id: 'clothing_004',
    title: 'Calvin Klein Cotton T-Shirt',
    price: '$25.00',
    finalPrice: '$19.99',
    imageUrl: 'https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/30052648/2024/JUNE/27/4jXDGCXu_e09b4b9ea7c04242abbfa96297bdd298.jpg',
    brand: 'Calvin Klein',
    category: 'Clothing',
    categories: ['Clothing', 'Tops', 'T-Shirts', 'Basic'],
    tags: ['Basic', 'Cotton', 'Comfortable', 'Casual'],
    rating: 4.2,
    reviewCount: 789,
    description: 'Calvin Klein cotton t-shirt for everyday comfort.',
    url: 'https://www.walmart.com/ip/Calvin-Klein-T-Shirt/321654987',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Gray', 'Navy'],
    specifications: [{ name: 'Brand', value: 'Calvin Klein' }]
  },
  {
    id: 'clothing_005',
    title: 'Columbia Fleece Jacket',
    price: '$80.00',
    finalPrice: '$64.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71U3Kf73llL.jpg',
    brand: 'Columbia',
    category: 'Clothing',
    categories: ['Clothing', 'Outerwear', 'Jackets', 'Fleece'],
    tags: ['Fleece', 'Warm', 'Outdoor', 'Comfortable'],
    rating: 4.5,
    reviewCount: 432,
    description: 'Columbia fleece jacket for warmth and comfort.',
    url: 'https://www.walmart.com/ip/Columbia-Fleece-Jacket/654321987',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Gray', 'Red'],
    specifications: [{ name: 'Brand', value: 'Columbia' }]
  },
  {
    id: 'clothing_006',
    title: 'H&M Slim Fit Dress Shirt',
    price: '$29.99',
    finalPrice: '$24.99',
    imageUrl: 'https://assets.myntassets.com/w_412,q_60,dpr_2,fl_progressive/assets/images/productimage/2020/7/28/0fed5839-31d5-4623-a992-57bf1ce6d1c31595891988666-1.jpg',
    brand: 'H&M',
    category: 'Clothing',
    categories: ['Clothing', 'Tops', 'Dress Shirts', 'Formal'],
    tags: ['Dress Shirt', 'Slim Fit', 'Formal', 'Professional'],
    rating: 4.1,
    reviewCount: 345,
    description: 'H&M slim fit dress shirt for professional wear.',
    url: 'https://www.walmart.com/ip/H-M-Dress-Shirt/987123456',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Pink', 'Light Blue'],
    specifications: [{ name: 'Brand', value: 'H&M' }]
  },
  {
    id: 'clothing_007',
    title: 'Under Armour Tech 2.0 Shorts',
    price: '$35.00',
    finalPrice: '$29.99',
    imageUrl: 'https://www.underarmour.in/media/catalog/product/cache/a6c9600f6d89dc76028bfa07e5e1eb9a/1/3/1326413-320250619124627970.jpeg',
    brand: 'Under Armour',
    category: 'Clothing',
    categories: ['Clothing', 'Bottoms', 'Shorts', 'Athletic'],
    tags: ['Shorts', 'Athletic', 'Tech', 'Comfortable'],
    rating: 4.3,
    reviewCount: 678,
    description: 'Under Armour Tech 2.0 shorts for athletic performance.',
    url: 'https://www.walmart.com/ip/Under-Armour-Tech-Shorts/123789456',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy', 'Red'],
    specifications: [{ name: 'Brand', value: 'Under Armour' }]
  },
  {
    id: 'clothing_008',
    title: 'Tommy Hilfiger Polo Shirt',
    price: '$45.00',
    finalPrice: '$39.99',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQWBAHTmXmACtXh0upb45pwf2ZAqSR1RS5Uw&s',
    brand: 'Tommy Hilfiger',
    category: 'Clothing',
    categories: ['Clothing', 'Tops', 'Polo Shirts', 'Casual'],
    tags: ['Polo', 'Classic', 'Casual', 'Comfortable'],
    rating: 4.4,
    reviewCount: 234,
    description: 'Tommy Hilfiger classic polo shirt for casual wear.',
    url: 'https://www.walmart.com/ip/Tommy-Hilfiger-Polo/456123789',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Red', 'White', 'Gray'],
    specifications: [{ name: 'Brand', value: 'Tommy Hilfiger' }]
  },
  {
    id: 'clothing_009',
    title: 'North Face Denali Jacket',
    price: '$200.00',
    finalPrice: '$169.99',
    imageUrl: 'https://assets.thenorthface.com/images/t_img/f_auto,h_400,w_344,e_unsharp_mask:150/dpr_2.0/v1723447833/NF0A88XGJK3-HERO/Mens-Retro-Denali-Hoodie.png?$PLP-IMAGE$',
    brand: 'The North Face',
    category: 'Clothing',
    categories: ['Clothing', 'Outerwear', 'Jackets', 'Fleece'],
    tags: ['Denali', 'Warm', 'Outdoor', 'Durable'],
    rating: 4.8,
    reviewCount: 156,
    description: 'North Face Denali jacket for outdoor adventures.',
    url: 'https://www.walmart.com/ip/North-Face-Denali/789456123',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Gray'],
    specifications: [{ name: 'Brand', value: 'The North Face' }]
  },
  {
    id: 'clothing_010',
    title: 'Ralph Lauren Oxford Shirt',
    price: '$65.00',
    finalPrice: '$54.99',
    imageUrl: 'https://dtcralphlauren.scene7.com/is/image/PoloGSI/s7-AI710549084006_alternate10?$rl_4x5_pdp$',
    brand: 'Ralph Lauren',
    category: 'Clothing',
    categories: ['Clothing', 'Tops', 'Dress Shirts', 'Oxford'],
    tags: ['Oxford', 'Classic', 'Cotton', 'Timeless'],
    rating: 4.6,
    reviewCount: 89,
    description: 'Ralph Lauren classic oxford shirt in cotton.',
    url: 'https://www.walmart.com/ip/Ralph-Lauren-Oxford/321987654',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Pink', 'Light Blue'],
    specifications: [{ name: 'Brand', value: 'Ralph Lauren' }]
  },
  {
    id: 'clothing_011',
    title: 'Puma RS-X Sneakers',
    price: '$110.00',
    finalPrice: '$89.99',
    imageUrl: 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/17350736/2022/4/19/fa280672-f64e-4abd-9ad3-11b0dc5a4cc21650350739399-Puma-Unisex-Casual-Shoes-371650350739121-1.jpg',
    brand: 'Puma',
    category: 'Clothing',
    categories: ['Clothing', 'Footwear', 'Sneakers', 'Retro'],
    tags: ['Sneakers', 'Retro', 'Stylish', 'Comfortable'],
    rating: 4.3,
    reviewCount: 234,
    description: 'Puma RS-X retro sneakers with bold design.',
    url: 'https://www.walmart.com/ip/Puma-RS-X-Sneakers/654789123',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['White/Red', 'Black/White', 'Blue/White'],
    specifications: [{ name: 'Brand', value: 'Puma' }]
  },
  {
    id: 'clothing_012',
    title: 'Banana Republic Chino Pants',
    price: '$70.00',
    finalPrice: '$59.99',
    imageUrl: 'https://images-cdn.ubuy.co.in/635034276034711dbd323868-banana-republic-mens-aiden-chino-pants.jpg',
    brand: 'Banana Republic',
    category: 'Clothing',
    categories: ['Clothing', 'Bottoms', 'Pants', 'Chinos'],
    tags: ['Chinos', 'Casual', 'Comfortable', 'Versatile'],
    rating: 4.5,
    reviewCount: 123,
    description: 'Banana Republic chino pants for casual comfort.',
    url: 'https://www.walmart.com/ip/Banana-Republic-Chinos/987654321',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    sizes: ['30x32', '32x32', '34x32', '36x32'],
    colors: ['Khaki', 'Navy', 'Olive', 'Gray'],
    specifications: [{ name: 'Brand', value: 'Banana Republic' }]
  },
  {
    id: 'clothing_013',
    title: 'New Balance 990v5 Running Shoes',
    price: '$185.00',
    finalPrice: '$159.99',
    imageUrl: 'https://images-static.nykaa.com/media/catalog/product/0/e/0ef6ad4FW-W990NV5_2.jpg?tr=w-500',
    brand: 'New Balance',
    category: 'Clothing',
    categories: ['Clothing', 'Footwear', 'Athletic Shoes', 'Running'],
    tags: ['Running', 'Comfortable', 'Durable', 'Made in USA'],
    rating: 4.7,
    reviewCount: 456,
    description: 'New Balance 990v5 running shoes with premium comfort.',
    url: 'https://www.walmart.com/ip/New-Balance-990v5/123456789',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Gray', 'Black', 'Navy'],
    specifications: [{ name: 'Brand', value: 'New Balance' }]
  },
  {
    id: 'clothing_014',
    title: 'J.Crew Factory Sweater',
    price: '$45.00',
    finalPrice: '$39.99',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwH9m2K3bZHx9p4exp8b_e5ikzggYqcPt3Zg&s',
    brand: 'J.Crew Factory',
    category: 'Clothing',
    categories: ['Clothing', 'Tops', 'Sweaters', 'Casual'],
    tags: ['Sweater', 'Casual', 'Warm', 'Comfortable'],
    rating: 4.2,
    reviewCount: 78,
    description: 'J.Crew Factory casual sweater for everyday wear.',
    url: 'https://www.walmart.com/ip/J-Crew-Factory-Sweater/456789123',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Gray', 'Burgundy', 'Camel'],
    specifications: [{ name: 'Brand', value: 'J.Crew Factory' }]
  },
  // ELECTRONICS PRODUCTS (10 items)
  {
    id: 'electronics_001',
    title: 'Samsung 55" Class QLED 4K UHD Q60C Series',
    price: '$799.99',
    finalPrice: '$649.99',
    imageUrl: 'https://image-us.samsung.com/SamsungUS/home/television-home-theater/tvs/qled-4k-tvs/07152024/QN85Q60CAFXZA-S_COM_Version_1_V01.jpg?$product-details-jpg$',
    brand: 'Samsung',
    category: 'Electronics',
    categories: ['Electronics', 'TV & Video', 'TVs', '4K TVs'],
    tags: ['4K', 'QLED', 'Smart TV', 'HDR'],
    rating: 4.8,
    reviewCount: 245,
    description: 'Experience stunning 4K resolution with Quantum HDR technology.',
    url: 'https://www.walmart.com/ip/Samsung-55-Class-QLED-4K-UHD-Q60C-Series/123456789',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['55"'],
    colors: ['Black'],
    specifications: [{ name: 'Brand', value: 'Samsung' }]
  },
  {
    id: 'electronics_002',
    title: 'Apple iPhone 15 Pro',
    price: '$999.00',
    finalPrice: '$949.99',
    imageUrl: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSdMPikrDCifku84SE4SG56NRq2vSnT2jWUiD_SENR1rQUGwMfh2yJfQCwfFmY4EnraXKx-0CfD4ob-kGd3egP_F4jcvPAbUlPase2pqOU',
    brand: 'Apple',
    category: 'Electronics',
    categories: ['Electronics', 'Cell Phones', 'Smartphones', 'iPhone'],
    tags: ['iPhone', '5G', 'Pro', 'Camera'],
    rating: 4.9,
    reviewCount: 1234,
    description: 'Apple iPhone 15 Pro with A17 Pro chip and titanium design.',
    url: 'https://www.walmart.com/ip/Apple-iPhone-15-Pro/987654321',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['128GB', '256GB', '512GB'],
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    specifications: [{ name: 'Brand', value: 'Apple' }]
  },
  {
    id: 'electronics_003',
    title: 'MacBook Air M2 13-inch',
    price: '$1199.00',
    finalPrice: '$1099.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71RDgtHsREL._UF1000,1000_QL80_.jpg',
    brand: 'Apple',
    category: 'Electronics',
    categories: ['Electronics', 'Computers', 'Laptops', 'MacBook'],
    tags: ['MacBook', 'M2', 'Laptop', 'Apple Silicon'],
    rating: 4.7,
    reviewCount: 567,
    description: 'MacBook Air with M2 chip for powerful performance.',
    url: 'https://www.walmart.com/ip/MacBook-Air-M2/456789123',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['256GB', '512GB', '1TB'],
    colors: ['Space Gray', 'Silver', 'Starlight', 'Midnight'],
    specifications: [{ name: 'Brand', value: 'Apple' }]
  },
  {
    id: 'electronics_004',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    price: '$399.99',
    finalPrice: '$349.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61ULAZmt9NL.jpg',
    brand: 'Sony',
    category: 'Electronics',
    categories: ['Electronics', 'Audio', 'Headphones', 'Wireless'],
    tags: ['Wireless', 'Noise Cancelling', 'Bluetooth', 'Premium'],
    rating: 4.8,
    reviewCount: 890,
    description: 'Sony WH-1000XM5 wireless noise-cancelling headphones.',
    url: 'https://www.walmart.com/ip/Sony-WH-1000XM5/321654987',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Black', 'Silver'],
    specifications: [{ name: 'Brand', value: 'Sony' }]
  },
  {
    id: 'electronics_005',
    title: 'Nintendo Switch OLED Model',
    price: '$349.99',
    finalPrice: '$299.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71Q54HnKxwS._UF894,1000_QL80_.jpg',
    brand: 'Nintendo',
    category: 'Electronics',
    categories: ['Electronics', 'Gaming', 'Consoles', 'Nintendo'],
    tags: ['Gaming', 'Console', 'OLED', 'Portable'],
    rating: 4.6,
    reviewCount: 2340,
    description: 'Nintendo Switch OLED model with 7-inch OLED screen.',
    url: 'https://www.walmart.com/ip/Nintendo-Switch-OLED/654321987',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['White', 'Neon Blue/Red'],
    specifications: [{ name: 'Brand', value: 'Nintendo' }]
  },
  {
    id: 'electronics_006',
    title: 'Canon EOS R7 Mirrorless Camera',
    price: '$1499.00',
    finalPrice: '$1399.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61QoynZYblL.jpg',
    brand: 'Canon',
    category: 'Electronics',
    categories: ['Electronics', 'Cameras', 'Mirrorless', 'DSLR'],
    tags: ['Camera', 'Mirrorless', '4K', 'Professional'],
    rating: 4.7,
    reviewCount: 123,
    description: 'Canon EOS R7 mirrorless camera with 32.5MP sensor.',
    url: 'https://www.walmart.com/ip/Canon-EOS-R7/987123456',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    colors: ['Black'],
    specifications: [{ name: 'Brand', value: 'Canon' }]
  },
  {
    id: 'electronics_007',
    title: 'iPad Air 5th Generation',
    price: '$599.00',
    finalPrice: '$549.99',
    imageUrl: 'https://i5.walmartimages.com/seo/iPad-Air-5th-Generation-10-9-inch_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Apple',
    category: 'Electronics',
    categories: ['Electronics', 'Tablets', 'iPad', 'Apple'],
    tags: ['iPad', 'Tablet', 'M1', 'Touch ID'],
    rating: 4.8,
    reviewCount: 678,
    description: 'iPad Air with M1 chip and 10.9-inch Liquid Retina display.',
    url: 'https://www.walmart.com/ip/iPad-Air-5th-Generation/123789456',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['64GB', '256GB'],
    colors: ['Space Gray', 'Pink', 'Purple', 'Blue', 'Starlight'],
    specifications: [{ name: 'Brand', value: 'Apple' }]
  },
  {
    id: 'electronics_008',
    title: 'Samsung Galaxy Tab S9',
    price: '$799.99',
    finalPrice: '$699.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Samsung-Galaxy-Tab-S9-11-inch_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Samsung',
    category: 'Electronics',
    categories: ['Electronics', 'Tablets', 'Android', 'Samsung'],
    tags: ['Tablet', 'Android', 'S Pen', 'AMOLED'],
    rating: 4.5,
    reviewCount: 234,
    description: 'Samsung Galaxy Tab S9 with 11-inch AMOLED display.',
    url: 'https://www.walmart.com/ip/Samsung-Galaxy-Tab-S9/456123789',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['128GB', '256GB'],
    colors: ['Graphite', 'Beige', 'Silver'],
    specifications: [{ name: 'Brand', value: 'Samsung' }]
  },
  {
    id: 'electronics_009',
    title: 'DJI Mini 3 Pro Drone',
    price: '$759.00',
    finalPrice: '$699.99',
    imageUrl: 'https://i5.walmartimages.com/seo/DJI-Mini-3-Pro-Drone-4K-Camera_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'DJI',
    category: 'Electronics',
    categories: ['Electronics', 'Drones', 'Camera Drones', 'DJI'],
    tags: ['Drone', '4K', 'Camera', 'Portable'],
    rating: 4.6,
    reviewCount: 456,
    description: 'DJI Mini 3 Pro drone with 4K camera and obstacle avoidance.',
    url: 'https://www.walmart.com/ip/DJI-Mini-3-Pro/789456123',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    colors: ['Gray'],
    specifications: [{ name: 'Brand', value: 'DJI' }]
  },
  {
    id: 'electronics_010',
    title: 'Sony PlayStation 5 Console',
    price: '$499.99',
    finalPrice: '$449.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Sony-PlayStation-5-Console_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Sony',
    category: 'Electronics',
    categories: ['Electronics', 'Gaming', 'Consoles', 'PlayStation'],
    tags: ['Gaming', 'Console', '4K', 'Blu-ray'],
    rating: 4.8,
    reviewCount: 2340,
    description: 'Sony PlayStation 5 console with next-gen gaming performance.',
    url: 'https://www.walmart.com/ip/Sony-PlayStation-5/123456789',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['White'],
    specifications: [{ name: 'Brand', value: 'Sony' }]
  },
  // HOME PRODUCTS (10 items)
  {
    id: 'home_001',
    title: 'Exultantex Grey Blackout Curtains for Living Room',
    price: '$70.80',
    finalPrice: '$47.88',
    imageUrl: 'https://i5.walmartimages.com/seo/Exultantex-Grey-Blackout-Curtains-for-Living-Room-Pom-Pom-Thermal-Window-Curtains-50-W-x-95-L-2-Panels-Rod-Pocket_f89aea0d-9d30-4bce-b65e-8c15732f1ca4.b20ae059333c322a0c8ea79bd569c7c7.jpeg',
    brand: 'Exultantex',
    category: 'Home',
    categories: ['Home', 'Decor', 'Curtains & Window Treatments', 'Curtains'],
    tags: ['Design', 'Pocket', 'Living Room', 'Drapes', 'Color'],
    rating: 4.6,
    reviewCount: 58,
    description: 'Soft triple weave fabric with a velvet-like texture.',
    url: 'https://www.walmart.com/ip/Exultantex-Grey-Blackout-Curtains/430528189',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    sizes: ['50" x 54"', '50" x 63"', '50" x 84"', '50" x 95"'],
    colors: ['Black', 'Blue', 'Green', 'Gray', 'Natural(Ivory)', 'Navy(Royal Blue)', 'Pink'],
    specifications: [{ name: 'Brand', value: 'Exultantex' }]
  },
  {
    id: 'home_002',
    title: '100% Cotton King Percale Duvet Set (3 Piece) Blue Distress Tile Print',
    price: '$71.99',
    finalPrice: '$49.99',
    imageUrl: 'https://i5.walmartimages.com/seo/100-Cotton-King-Percale-Duvet-Set-3-Piece-Blue-Distress-Tile-Print-by-Simply-Put_d88fe658-b9fa-48fa-ad77-456edf23b3a5_2.017c4cd5ba8d3df3f9e3863ae7811e48.jpeg',
    brand: 'Simply Put',
    category: 'Home',
    categories: ['Home', 'Bedding', 'Duvet Covers', 'King Duvet Covers'],
    tags: ['Color', 'Cover', 'Wash', 'Soft', 'Appearance'],
    rating: 4.7,
    reviewCount: 101,
    description: 'Inspired by decorative blue and white tiles, the Simply Put 100% Cotton Distress Tile Print Duvet Set.',
    url: 'https://www.walmart.com/ip/100-Cotton-King-Percale-Duvet-Set/161657830',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    sizes: ['Queen', 'King'],
    colors: ['Beige', 'Blue', 'Gray', 'Spa Blue'],
    specifications: [{ name: 'Brand', value: 'Simply Put' }]
  },
  {
    id: 'home_003',
    title: 'Keurig K-Classic Coffee Maker',
    price: '$129.99',
    finalPrice: '$99.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61wQb8IB8UL.jpg',
    brand: 'Keurig',
    category: 'Home',
    categories: ['Home', 'Kitchen', 'Coffee Makers', 'Single Serve'],
    tags: ['Coffee Maker', 'Single Serve', 'K-Cup', 'Quick'],
    rating: 4.4,
    reviewCount: 2340,
    description: 'Keurig K-Classic single-serve coffee maker.',
    url: 'https://www.walmart.com/ip/Keurig-K-Classic/123456789',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Black', 'Red', 'Silver'],
    specifications: [{ name: 'Brand', value: 'Keurig' }]
  },
  {
    id: 'home_004',
    title: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    price: '$99.99',
    finalPrice: '$79.99',
    imageUrl: 'https://m.media-amazon.com/images/I/71thcs5a-WL._UF894,1000_QL80_.jpg',
    brand: 'Instant Pot',
    category: 'Home',
    categories: ['Home', 'Kitchen', 'Appliances', 'Pressure Cookers'],
    tags: ['Pressure Cooker', 'Multi-function', 'Electric', 'Cooking'],
    rating: 4.6,
    reviewCount: 5670,
    description: 'Instant Pot Duo 7-in-1 electric pressure cooker.',
    url: 'https://www.walmart.com/ip/Instant-Pot-Duo/987654321',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Stainless Steel'],
    specifications: [{ name: 'Brand', value: 'Instant Pot' }]
  },
  {
    id: 'home_005',
    title: 'Dyson V15 Detect Cordless Vacuum',
    price: '$699.99',
    finalPrice: '$599.99',
    imageUrl: 'https://m.media-amazon.com/images/I/61bXGHeYuhL.jpg',
    brand: 'Dyson',
    category: 'Home',
    categories: ['Home', 'Cleaning', 'Vacuums', 'Cordless'],
    tags: ['Vacuum', 'Cordless', 'Powerful', 'Clean'],
    rating: 4.8,
    reviewCount: 890,
    description: 'Dyson V15 Detect cordless vacuum with laser technology.',
    url: 'https://www.walmart.com/ip/Dyson-V15-Detect/456789123',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    colors: ['Gold', 'Nickel'],
    specifications: [{ name: 'Brand', value: 'Dyson' }]
  },
  {
    id: 'home_006',
    title: 'Ninja Foodi 9-in-1 Deluxe XL Cooker',
    price: '$199.99',
    finalPrice: '$169.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Ninja-Foodi-9-in-1-Deluxe-XL-Cooker_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Ninja',
    category: 'Home',
    categories: ['Home', 'Kitchen', 'Appliances', 'Multi-cookers'],
    tags: ['Multi-cooker', 'Air Fryer', 'Pressure Cooker', 'Versatile'],
    rating: 4.5,
    reviewCount: 1234,
    description: 'Ninja Foodi 9-in-1 Deluxe XL cooker with air fryer.',
    url: 'https://www.walmart.com/ip/Ninja-Foodi-Deluxe-XL/321654987',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Stainless Steel'],
    specifications: [{ name: 'Brand', value: 'Ninja' }]
  },
  {
    id: 'home_007',
    title: 'Philips Hue White and Color Ambiance Starter Kit',
    price: '$199.99',
    finalPrice: '$179.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Philips-Hue-White-and-Color-Ambiance-Starter-Kit_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Philips Hue',
    category: 'Home',
    categories: ['Home', 'Lighting', 'Smart Lighting', 'LED Bulbs'],
    tags: ['Smart Lighting', 'Color', 'WiFi', 'App Control'],
    rating: 4.7,
    reviewCount: 567,
    description: 'Philips Hue White and Color Ambiance smart lighting starter kit.',
    url: 'https://www.walmart.com/ip/Philips-Hue-Starter-Kit/654321987',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['White', 'Color'],
    specifications: [{ name: 'Brand', value: 'Philips Hue' }]
  },
  {
    id: 'home_008',
    title: 'Ring Video Doorbell Pro 2',
    price: '$249.99',
    finalPrice: '$199.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Ring-Video-Doorbell-Pro-2_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Ring',
    category: 'Home',
    categories: ['Home', 'Security', 'Doorbells', 'Smart Home'],
    tags: ['Video Doorbell', 'Security', 'WiFi', 'Motion Detection'],
    rating: 4.6,
    reviewCount: 890,
    description: 'Ring Video Doorbell Pro 2 with 3D motion detection.',
    url: 'https://www.walmart.com/ip/Ring-Video-Doorbell-Pro-2/987123456',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Black', 'White'],
    specifications: [{ name: 'Brand', value: 'Ring' }]
  },
  {
    id: 'home_009',
    title: 'Samsung 4-Door French Door Refrigerator',
    price: '$1299.99',
    finalPrice: '$1099.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Samsung-4-Door-French-Door-Refrigerator_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Samsung',
    category: 'Home',
    categories: ['Home', 'Appliances', 'Refrigerators', 'French Door'],
    tags: ['Refrigerator', 'French Door', 'Stainless Steel', 'Large Capacity'],
    rating: 4.5,
    reviewCount: 234,
    description: 'Samsung 4-door French door refrigerator with large capacity.',
    url: 'https://www.walmart.com/ip/Samsung-4-Door-Refrigerator/123789456',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    colors: ['Stainless Steel', 'Black Stainless'],
    specifications: [{ name: 'Brand', value: 'Samsung' }]
  },
  {
    id: 'home_010',
    title: 'KitchenAid Artisan Stand Mixer',
    price: '$399.99',
    finalPrice: '$349.99',
    imageUrl: 'https://i5.walmartimages.com/seo/KitchenAid-Artisan-Stand-Mixer_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'KitchenAid',
    category: 'Home',
    categories: ['Home', 'Kitchen', 'Appliances', 'Mixers'],
    tags: ['Stand Mixer', 'KitchenAid', 'Professional', 'Baking'],
    rating: 4.9,
    reviewCount: 1567,
    description: 'KitchenAid Artisan stand mixer for professional baking.',
    url: 'https://www.walmart.com/ip/KitchenAid-Artisan-Mixer/456789123',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Empire Red', 'Black', 'White', 'Silver'],
    specifications: [{ name: 'Brand', value: 'KitchenAid' }]
  },
  // SPORTS PRODUCTS (10 items)
  {
    id: 'sports_001',
    title: 'Nike Air Max 270 Men\'s Running Shoes',
    price: '$150.00',
    finalPrice: '$119.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Nike-Air-Max-270-Men-s-Running-Shoes_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Nike',
    category: 'Sports',
    categories: ['Sports', 'Footwear', 'Athletic Shoes', 'Running'],
    tags: ['Running', 'Athletic', 'Comfortable', 'Stylish'],
    rating: 4.6,
    reviewCount: 189,
    description: 'Maximum comfort with Air Max 270 technology.',
    url: 'https://www.walmart.com/ip/Nike-Air-Max-270-Men-s-Running-Shoes/987654321',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black/White', 'Blue/White', 'Red/White'],
    specifications: [{ name: 'Brand', value: 'Nike' }]
  },
  {
    id: 'sports_002',
    title: 'Wilson Official NBA Basketball',
    price: '$69.99',
    finalPrice: '$59.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Wilson-Official-NBA-Basketball_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Wilson',
    category: 'Sports',
    categories: ['Sports', 'Basketball', 'Balls', 'Official'],
    tags: ['Basketball', 'Official', 'NBA', 'Wilson'],
    rating: 4.8,
    reviewCount: 456,
    description: 'Wilson official NBA basketball for professional play.',
    url: 'https://www.walmart.com/ip/Wilson-NBA-Basketball/123456789',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['Official Size'],
    colors: ['Orange'],
    specifications: [{ name: 'Brand', value: 'Wilson' }]
  },
  {
    id: 'sports_003',
    title: 'Bowflex SelectTech 552 Adjustable Dumbbells',
    price: '$429.00',
    finalPrice: '$399.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Bowflex-SelectTech-552-Adjustable-Dumbbells_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Bowflex',
    category: 'Sports',
    categories: ['Sports', 'Fitness', 'Weights', 'Dumbbells'],
    tags: ['Dumbbells', 'Adjustable', 'Fitness', 'Home Gym'],
    rating: 4.7,
    reviewCount: 234,
    description: 'Bowflex SelectTech 552 adjustable dumbbells.',
    url: 'https://www.walmart.com/ip/Bowflex-SelectTech-552/987654321',
    availableForDelivery: true,
    availableForPickup: false,
    discount: 'Reduced price',
    sizes: ['5-52.5 lbs'],
    colors: ['Black'],
    specifications: [{ name: 'Brand', value: 'Bowflex' }]
  },
  {
    id: 'sports_004',
    title: 'YETI Rambler 20 oz Tumbler',
    price: '$34.99',
    finalPrice: '$29.99',
    imageUrl: 'https://i5.walmartimages.com/seo/YETI-Rambler-20-oz-Tumbler_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'YETI',
    category: 'Sports',
    categories: ['Sports', 'Outdoor', 'Drinkware', 'Tumblers'],
    tags: ['Tumbler', 'Insulated', 'Stainless Steel', 'Outdoor'],
    rating: 4.9,
    reviewCount: 1234,
    description: 'YETI Rambler 20 oz tumbler with vacuum insulation.',
    url: 'https://www.walmart.com/ip/YETI-Rambler-20-oz/456789123',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Stainless Steel', 'Black', 'White', 'Navy'],
    specifications: [{ name: 'Brand', value: 'YETI' }]
  },
  {
    id: 'sports_005',
    title: 'Fitbit Charge 5 Fitness Tracker',
    price: '$179.95',
    finalPrice: '$149.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Fitbit-Charge-5-Fitness-Tracker_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Fitbit',
    category: 'Sports',
    categories: ['Sports', 'Fitness', 'Wearables', 'Fitness Trackers'],
    tags: ['Fitness Tracker', 'Heart Rate', 'GPS', 'Sleep Tracking'],
    rating: 4.5,
    reviewCount: 890,
    description: 'Fitbit Charge 5 fitness tracker with advanced health metrics.',
    url: 'https://www.walmart.com/ip/Fitbit-Charge-5/321654987',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Black', 'Blue', 'White'],
    specifications: [{ name: 'Brand', value: 'Fitbit' }]
  },
  {
    id: 'sports_006',
    title: 'Coleman Sundome 4-Person Tent',
    price: '$89.99',
    finalPrice: '$69.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Coleman-Sundome-4-Person-Tent_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Coleman',
    category: 'Sports',
    categories: ['Sports', 'Outdoor', 'Camping', 'Tents'],
    tags: ['Tent', 'Camping', '4-Person', 'Weatherproof'],
    rating: 4.4,
    reviewCount: 567,
    description: 'Coleman Sundome 4-person tent for camping adventures.',
    url: 'https://www.walmart.com/ip/Coleman-Sundome-Tent/654321987',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Blue', 'Green'],
    specifications: [{ name: 'Brand', value: 'Coleman' }]
  },
  {
    id: 'sports_007',
    title: 'Garmin Forerunner 245 GPS Running Watch',
    price: '$299.99',
    finalPrice: '$249.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Garmin-Forerunner-245-GPS-Running-Watch_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Garmin',
    category: 'Sports',
    categories: ['Sports', 'Fitness', 'Wearables', 'GPS Watches'],
    tags: ['GPS Watch', 'Running', 'Heart Rate', 'Training'],
    rating: 4.6,
    reviewCount: 345,
    description: 'Garmin Forerunner 245 GPS running watch with advanced training features.',
    url: 'https://www.walmart.com/ip/Garmin-Forerunner-245/987123456',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    colors: ['Black', 'Blue', 'Red'],
    specifications: [{ name: 'Brand', value: 'Garmin' }]
  },
  {
    id: 'sports_008',
    title: 'Under Armour Tech 2.0 Shorts',
    price: '$35.00',
    finalPrice: '$29.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Under-Armour-Tech-2-0-Shorts-Mens-Athletic_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Under Armour',
    category: 'Sports',
    categories: ['Sports', 'Athletic Wear', 'Shorts', 'Training'],
    tags: ['Shorts', 'Athletic', 'Tech', 'Comfortable'],
    rating: 4.3,
    reviewCount: 678,
    description: 'Under Armour Tech 2.0 shorts for athletic performance.',
    url: 'https://www.walmart.com/ip/Under-Armour-Tech-Shorts/123789456',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Navy', 'Red'],
    specifications: [{ name: 'Brand', value: 'Under Armour' }]
  },
  {
    id: 'sports_009',
    title: 'Spalding NBA Official Game Basketball',
    price: '$59.99',
    finalPrice: '$49.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Spalding-NBA-Official-Game-Basketball_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Spalding',
    category: 'Sports',
    categories: ['Sports', 'Basketball', 'Balls', 'Official'],
    tags: ['Basketball', 'Official', 'NBA', 'Spalding'],
    rating: 4.7,
    reviewCount: 234,
    description: 'Spalding NBA official game basketball.',
    url: 'https://www.walmart.com/ip/Spalding-NBA-Basketball/456123789',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['Official Size'],
    colors: ['Orange'],
    specifications: [{ name: 'Brand', value: 'Spalding' }]
  },
  {
    id: 'sports_010',
    title: 'Adidas Ultraboost 21 Running Shoes',
    price: '$180.00',
    finalPrice: '$149.99',
    imageUrl: 'https://i5.walmartimages.com/seo/Adidas-Ultraboost-21-Running-Shoes-Mens_1f8b8b8b-8b8b-8b8b-8b8b-8b8b8b8b8b8b.jpeg',
    brand: 'Adidas',
    category: 'Sports',
    categories: ['Sports', 'Footwear', 'Athletic Shoes', 'Running'],
    tags: ['Running', 'Ultraboost', 'Athletic', 'Comfortable'],
    rating: 4.7,
    reviewCount: 567,
    description: 'Adidas Ultraboost 21 running shoes with responsive cushioning.',
    url: 'https://www.walmart.com/ip/Adidas-Ultraboost-21/456789123',
    availableForDelivery: true,
    availableForPickup: true,
    discount: 'Reduced price',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black/White', 'Blue/White', 'Gray/White'],
    specifications: [{ name: 'Brand', value: 'Adidas' }]
  }
];

// Clear cache to force reload
export const clearWalmartCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('walmart_products_cache');
    console.log('Walmart products cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

// Get all products
export const getAllWalmartProducts = (): WalmartProduct[] => {
  return WALMART_PRODUCTS;
};

// Get products by category
export const getWalmartProductsByCategory = (categoryName: string): WalmartProduct[] => {
  if (categoryName === 'All') {
    return WALMART_PRODUCTS;
  }
  return WALMART_PRODUCTS.filter(product => 
    product.category === categoryName || 
    product.categories.includes(categoryName)
  );
};

// Search products
export const searchWalmartProducts = (query: string): WalmartProduct[] => {
  if (!query.trim()) return WALMART_PRODUCTS;
  
  const lowerQuery = query.toLowerCase();
  return WALMART_PRODUCTS.filter(product =>
    product.title.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Get products by tag
export const getWalmartProductsByTag = (tag: string): WalmartProduct[] => {
  return WALMART_PRODUCTS.filter(product =>
    product.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
};

// Get categories with counts
export const getWalmartCategories = (): { name: string, count: number }[] => {
  const categoryCounts: { [key: string]: number } = {};
  
  WALMART_PRODUCTS.forEach(product => {
    categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
  });
  
  const categories = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  // Add "All" as the first option with total count
  const totalCount = WALMART_PRODUCTS.length;
  return [{ name: 'All', count: totalCount }, ...categories];
};

// Get all tags
export const getWalmartTags = (): string[] => {
  const tagSet = new Set<string>();
  WALMART_PRODUCTS.forEach(product => {
    product.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

// Get top rated products
export const getTopRatedWalmartProducts = (limit: number = 10): WalmartProduct[] => {
  return WALMART_PRODUCTS
    .filter(product => product.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

// Get best sellers by category
export const getBestSellersByCategory = (category: string, limit: number = 5): WalmartProduct[] => {
  const categoryProducts = getWalmartProductsByCategory(category);
  return categoryProducts
    .filter(product => product.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

// Get discounted products
export const getDiscountedWalmartProducts = (): WalmartProduct[] => {
  return WALMART_PRODUCTS.filter(product => 
    product.discount && product.discount.includes('Reduced price')
  );
};

// Get products with free delivery
export const getWalmartProductsWithFreeDelivery = (): WalmartProduct[] => {
  return WALMART_PRODUCTS.filter(product => product.availableForDelivery);
};

// Get products with pickup available
export const getWalmartProductsWithPickup = (): WalmartProduct[] => {
  return WALMART_PRODUCTS.filter(product => product.availableForPickup);
}; 