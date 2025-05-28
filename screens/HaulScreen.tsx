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
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation';
import { Product, getCategories, getTags, getProductsByCategory, getProductsByTag, searchProducts, hasVisitedHaulScreen, recordHaulScreenVisit } from '../utils/dataSource';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [leftColumn, setLeftColumn] = useState<Product[]>([]);
  const [rightColumn, setRightColumn] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<{name: string, count: number}[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Load categories and tags
  useEffect(() => {
    setCategories(getCategories());
    setTags(getTags());
  }, []);

  // Check if user is visiting for the first time
  const checkFirstTimeUser = async () => {
    const visited = await hasVisitedHaulScreen();
    if (!visited) {
      setShowTutorial(true);
      await recordHaulScreenVisit();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }).start();
    }
  };

  // Function to fetch products based on selected category, tags, and search query
  const fetchProducts = useCallback(() => {
    setLoading(true);
    
    let filteredProducts: Product[] = [];
    
    // First check if we have a search query
    if (searchQuery.trim()) {
      filteredProducts = searchProducts(searchQuery);
    } 
    // Then check if we have selected tags
    else if (selectedTags.length > 0) {
      // Get products that have ALL selected tags
      filteredProducts = getProductsByCategory(selectedCategory);
      
      selectedTags.forEach(tag => {
        filteredProducts = filteredProducts.filter(product => 
          product.tags.some(t => t === tag)
        );
      });
    } 
    // Otherwise, just filter by category
    else {
      filteredProducts = getProductsByCategory(selectedCategory);
    }
    
    // Sort products to ensure consistent ordering
    filteredProducts.sort((a, b) => a.id.localeCompare(b.id));
    
    setProducts(filteredProducts);
    
    // Update categories count
    setCategories(getCategories());
    
    // Distribute products in left and right columns for masonry grid
    const left: Product[] = [];
    const right: Product[] = [];
    
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
    checkFirstTimeUser();
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

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
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

  const renderProductColumn = (columnItems: Product[]) => {
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
              <Text style={styles.discountedPrice}>{item.discountedPrice}</Text>
              <Text style={styles.originalPrice}>{item.price}</Text>
            </View>
            <View style={styles.productTagsContainer}>
              {item.tags.slice(0, 2).map((tag, idx) => (
                <TouchableOpacity 
                  key={idx} 
                  style={styles.productTag}
                  onPress={() => handleTagSelect(tag)}
                >
                  <Text style={styles.productTagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  const closeTutorial = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setShowTutorial(false);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands & more"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={fetchProducts}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                fetchProducts();
              }}
              style={styles.clearButton}
            >
              <Icon name="x" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.tagsContainer}>
        <Text style={styles.tagsTitle}>Popular Tags:</Text>
        <FlatList
          data={tags}
          renderItem={renderTagItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsList}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF385C" />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="search" size={50} color="#999" />
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>Try a different search or category</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.productGridContainer}>
          <View style={styles.columnContainer}>
            <View style={styles.column}>
              {renderProductColumn(leftColumn)}
            </View>
            <View style={styles.column}>
              {renderProductColumn(rightColumn)}
            </View>
          </View>
        </ScrollView>
      )}

      {showTutorial && (
        <Animated.View
          style={[
            styles.tutorialOverlay,
            {
              opacity: fadeAnim
            }
          ]}
        >
          <View style={styles.tutorialContent}>
            <Text style={styles.tutorialTitle}>Welcome to Discover!</Text>
            <Text style={styles.tutorialText}>
              • Browse products by categories or tags{'\n'}
              • Search for specific products{'\n'}
              • Tap on a product to view details
            </Text>
            <TouchableOpacity
              style={styles.tutorialButton}
              onPress={closeTutorial}
            >
              <Text style={styles.tutorialButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    paddingBottom: 8,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFFFFF',
    fontSize: 14,
    placeholderTextColor: '#888',
  },
  clearButton: {
    padding: 6,
  },
  categoriesContainer: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryItem: {
    backgroundColor: '#FF385C',
  },
  categoryText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tagsContainer: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tagsTitle: {
    fontSize: 14,
    color: '#AAAAAA',
    marginLeft: 16,
    marginBottom: 4,
  },
  tagsList: {
    paddingHorizontal: 16,
  },
  tagItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedTagItem: {
    backgroundColor: '#4C1D3F',
    borderColor: '#FF385C',
  },
  tagText: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  selectedTagText: {
    color: '#FF385C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#121212',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#CCCCCC',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  productGridContainer: {
    padding: 16,
    backgroundColor: '#121212',
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: COLUMN_WIDTH,
  },
  productCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  productImage: {
    width: '100%',
    height: '65%',
    backgroundColor: '#2A2A2A',
  },
  productInfo: {
    padding: 8,
  },
  brandText: {
    fontSize: 12,
    color: '#AAAAAA',
    fontWeight: '500',
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 4,
    color: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  discountedPrice: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  productTagsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  productTag: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
  },
  productTagText: {
    fontSize: 10,
    color: '#AAAAAA',
  },
  tutorialOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  tutorialContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  tutorialText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
    lineHeight: 24,
  },
  tutorialButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  tutorialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HaulScreen; 