import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Animated,
  Platform,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation';
import { 
  WalmartProduct, 
  loadWalmartProducts,
  clearWalmartCache,
  getWalmartCategories, 
  getWalmartTags, 
  getWalmartProductsByCategory, 
  getWalmartProductsByTag, 
  searchWalmartProducts, 
  getTopRatedWalmartProducts,
  getDiscountedWalmartProducts,
  getBestSellersByCategory,
  getAllWalmartProducts
} from '../utils/walmartDataSource';
import WalmartChatbot from '../components/WalmartChatbot';
import { LinearGradient } from 'expo-linear-gradient';

// Calculate dimensions for masonry grid
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_GAP = 10;
const NUM_COLUMNS = 2;
const COLUMN_WIDTH = (SCREEN_WIDTH - 32 - COLUMN_GAP) / NUM_COLUMNS;

type HaulScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Haul'>;

// Helper function to generate random heights for masonry layout
const getRandomHeight = () => {
  // Return a height between 200 and 350
  return Math.floor(Math.random() * 150) + 200;
};

const HaulScreen: React.FC = () => {
  const navigation = useNavigation<HaulScreenNavigationProp>();
  const [products, setProducts] = useState<WalmartProduct[]>([]);
  const [leftColumn, setLeftColumn] = useState<WalmartProduct[]>([]);
  const [rightColumn, setRightColumn] = useState<WalmartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<{name: string, count: number}[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<WalmartProduct[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<WalmartProduct[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load Walmart products and data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await clearWalmartCache();
      await loadWalmartProducts();
      // Clear cache to force reload of CSV data
      setCategories(getWalmartCategories());
      setTags(getWalmartTags());
      // Get a mix of Apple products, clothes, and beauty products for Today's Best Deals
      const allProducts = getAllWalmartProducts();
      const appleProducts = allProducts.filter(p => p.brand.toLowerCase().includes('apple')).slice(0, 2);
      const clothingProducts = allProducts.filter(p => p.category === 'Clothing').slice(0, 3);
      const beautyProducts = allProducts.filter(p => p.category === 'Beauty').slice(0, 3);
      
      // Combine and shuffle to get a good mix
      const featuredMix = [...appleProducts, ...clothingProducts, ...beautyProducts];
      setFeaturedProducts(featuredMix.slice(0, 8));
      setDiscountedProducts(getDiscountedWalmartProducts().slice(0, 6));
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Function to fetch products based on selected category, tags, and search query
  const fetchProducts = useCallback(() => {
    setLoading(true);
    
    let filteredProducts: WalmartProduct[] = [];
    
    // First check if we have a search query
    if (searchQuery.trim()) {
      filteredProducts = searchWalmartProducts(searchQuery);
    } 
    // Then check if we have selected tags
    else if (selectedTags.length > 0) {
      // Get products that have ALL selected tags
      filteredProducts = getWalmartProductsByCategory(selectedCategory);
      
      selectedTags.forEach(tag => {
        filteredProducts = filteredProducts.filter(product => 
          product.tags.some(t => t === tag)
        );
      });
    } 
    // Otherwise, just filter by category
    else {
      filteredProducts = getWalmartProductsByCategory(selectedCategory);
    }
    
    // Sort products to ensure consistent ordering
    filteredProducts.sort((a, b) => a.id.localeCompare(b.id));
    
    setProducts(filteredProducts);
    
    // Update categories count
    setCategories(getWalmartCategories());
    
    // Distribute products in left and right columns for masonry grid
    const left: WalmartProduct[] = [];
    const right: WalmartProduct[] = [];
    
    filteredProducts.forEach((product, index) => {
      if (index % 2 === 0) {
        left.push(product);
      } else {
        right.push(product);
      }
    });
    
    setLeftColumn(left);
    setRightColumn(right);
    setLoading(false);
  }, [selectedCategory, searchQuery, selectedTags]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      // If tag is already selected, remove it
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      }
      // Otherwise, add it to the selection
      return [...prev, tag];
    });
  };

  const handleProductPress = (product: WalmartProduct) => {
    // Convert WalmartProduct to Product format for navigation
    const convertedProduct = {
      id: product.id,
      title: product.title,
      price: product.finalPrice,
      discountedPrice: product.price !== product.finalPrice ? product.price : undefined,
      imageUrl: product.imageUrl,
      brand: product.brand,
      category: product.category,
      tags: product.tags,
      rating: product.rating.toString(),
      gender: 'Unisex' as const,
      reviewCount: product.reviewCount.toString(),
      description: product.description
    };
    navigation.navigate('ProductDetail', { product: convertedProduct });
  };

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.name && styles.selectedCategoryItem
      ]}
      onPress={() => handleCategorySelect(item.name)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.name && styles.selectedCategoryText
        ]}
      >
        {item.name} ({item.count})
      </Text>
    </TouchableOpacity>
  );

  const renderTagItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.tagItem,
        selectedTags.includes(item) && styles.selectedTagItem
      ]}
      onPress={() => handleTagSelect(item)}
    >
      <Text
        style={[
          styles.tagText,
          selectedTags.includes(item) && styles.selectedTagText
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderProductColumn = (columnItems: WalmartProduct[]) => {
    return columnItems.map((item, index) => {
      const productHeight = getRandomHeight();
      
      return (
        <TouchableOpacity
          key={item.id}
          style={[styles.productCard, { height: productHeight }]}
          onPress={() => handleProductPress(item)}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.productInfo}>
            <Text style={styles.brandText}>{item.brand}</Text>
            <Text style={styles.productTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>{item.finalPrice}</Text>
              {item.price !== item.finalPrice && (
                <Text style={styles.originalPrice}>{item.price}</Text>
              )}
            </View>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({item.reviewCount})</Text>
            </View>
            {item.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>Sale</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };

  const renderFeaturedProduct = ({ item }: { item: WalmartProduct }) => (
    <TouchableOpacity
      style={styles.featuredProductCard}
      onPress={() => handleProductPress(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.featuredProductImage} />
      <View style={styles.featuredProductInfo}>
        <Text style={styles.featuredProductTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.featuredProductBrand}>{item.brand}</Text>
        <View style={styles.featuredPriceContainer}>
          <Text style={styles.featuredPriceText}>{item.finalPrice}</Text>
          {item.price !== item.finalPrice && (
            <Text style={styles.featuredOriginalPrice}>{item.price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDiscountProduct = ({ item }: { item: WalmartProduct }) => (
    <TouchableOpacity
      style={styles.discountProductCard}
      onPress={() => handleProductPress(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.discountProductImage} />
      <View style={styles.discountBadgeOverlay}>
        <Text style={styles.discountBadgeText}>SALE</Text>
      </View>
      <View style={styles.discountProductInfo}>
        <Text style={styles.discountProductTitle} numberOfLines={5}>
          {item.title}
        </Text>
        <View style={styles.discountPriceContainer}>
          <Text style={styles.discountPriceText}>{item.finalPrice}</Text>
          <Text style={styles.discountOriginalPrice}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF385C" />
        <Text style={styles.loadingText}>Loading Walmart products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#FF385C', '#FF6B8A', '#FF8FA3']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          {!showSearchBar ? (
            <>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Walmart Shopping</Text>
                <Text style={styles.headerSubtitle}>Discover amazing deals</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={() => setShowSearchBar(true)}
                >
                  <MaterialIcons name="search" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cartButton}>
                  <MaterialIcons name="shopping-cart" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.searchBarContainer}>
              <View style={styles.searchBar}>
                <MaterialIcons name="search" size={20} color="#FFFFFF" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search products..."
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus={true}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <MaterialIcons name="close" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShowSearchBar(false)}>
                  <MaterialIcons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </LinearGradient>



      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Today's Best Deals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="local-fire-department" size={24} color="#FF385C" />
              <Text style={styles.sectionTitle}>Today's Best Deals</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredProducts}
            renderItem={renderFeaturedProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Sunday Sale */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="local-offer" size={24} color="#FF385C" />
              <Text style={styles.sectionTitle}>Sunday Sale</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={discountedProducts}
            renderItem={renderDiscountProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.discountList}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="category" size={24} color="#333" />
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Tags */}
        {tags.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <MaterialIcons name="tag" size={24} color="#333" />
              <Text style={styles.sectionTitle}>Popular Tags</Text>
            </View>
            <View style={styles.tagsContainer}>
              {tags.slice(0, 10).map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagItem,
                    selectedTags.includes(tag) && styles.selectedTagItem
                  ]}
                  onPress={() => handleTagSelect(tag)}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedTags.includes(tag) && styles.selectedTagText
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Products Grid */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="grid-view" size={24} color="#333" />
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </Text>
          </View>
          <View style={styles.productsGrid}>
            <View style={styles.column}>
              {renderProductColumn(leftColumn)}
            </View>
            <View style={styles.column}>
              {renderProductColumn(rightColumn)}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Chatbot */}
      <WalmartChatbot onProductPress={handleProductPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingBottom: 25,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 2,
    opacity: 0.9,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBarContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
    paddingTop: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
    paddingTop: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF385C',
    fontWeight: '500',
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  featuredProductCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 12,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredProductImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  featuredProductInfo: {
    flex: 1,
  },
  featuredProductTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  featuredProductBrand: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  featuredPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredPriceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF385C',
  },
  featuredOriginalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  discountList: {
    paddingHorizontal: 20,
  },
  discountProductCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 12,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  discountProductImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  discountBadgeOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF385C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  discountProductInfo: {
    flex: 1,
  },
  discountProductTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  discountPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountPriceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF385C',
  },
  discountOriginalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategoryItem: {
    backgroundColor: '#FF385C',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  tagItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedTagItem: {
    backgroundColor: '#FF385C',
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
  selectedTagText: {
    color: '#FFFFFF',
  },
  productsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productInfo: {
    padding: 12,
  },
  brandText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF385C',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF385C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default HaulScreen; 