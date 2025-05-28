import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import Icon from 'react-native-vector-icons/Feather';
import { Product } from '../utils/dataSource';

type ProductDetailRouteProp = RouteProp<MainStackParamList, 'ProductDetail'>;
type ProductDetailNavigationProp = NativeStackNavigationProp<MainStackParamList, 'ProductDetail'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const route = useRoute<ProductDetailRouteProp>();
  const { product } = route.params;
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  // Create a random list of available sizes
  const availableSizes = React.useMemo(() => {
    const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    // Randomly select 3-5 sizes as available
    const numSizes = Math.floor(Math.random() * 3) + 3;
    const shuffled = [...allSizes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numSizes);
  }, [product.id]);
  
  const discountPercentage = React.useMemo(() => {
    if (!product.discountedPrice) return 0;
    
    const originalPrice = parseInt(product.price.replace('₹', ''));
    const discountedPrice = parseInt(product.discountedPrice.replace('₹', ''));
    
    if (isNaN(originalPrice) || isNaN(discountedPrice)) return 0;
    
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }, [product.price, product.discountedPrice]);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };
  
  const handleAddToBag = () => {
    // In a real app, this would add the product to cart
    alert(`Added ${product.title} (Size: ${selectedSize || 'Not selected'}) to bag`);
  };
  
  const handleTryOn = () => {
    // Navigate to the TryingRoom screen with this product
    navigation.navigate('TryingRoom', { product });
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
            <Icon name={isFavorite ? "heart" : "heart"} size={24} color={isFavorite ? "#FF4089" : "#333"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="share-2" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <Image
          source={{ uri: product.imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.brandRow}>
            <Text style={styles.brandText}>{product.brand}</Text>
            {product.rating && (
              <View style={styles.ratingContainer}>
                <Icon name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{product.rating}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.productTitle}>{product.title}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.discountedPrice}>{product.discountedPrice || product.price}</Text>
            {product.discountedPrice && (
              <>
                <Text style={styles.originalPrice}>{product.price}</Text>
                <Text style={styles.discountPercentage}>{discountPercentage}% OFF</Text>
              </>
            )}
          </View>
          
          {/* Tags */}
          <View style={styles.tagsContainer}>
            {product.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          {/* Size Selection */}
          <View style={styles.sizeSection}>
            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.sizesContainer}>
              {availableSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.selectedSizeButton
                  ]}
                  onPress={() => handleSizeSelect(size)}
                >
                  <Text 
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.selectedSizeText
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Product Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{product.category}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{product.gender}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Brand</Text>
              <Text style={styles.detailValue}>{product.brand}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.tryOnButton]}
          onPress={handleTryOn}
        >
          <Icon name="camera" size={18} color="#FF4089" />
          <Text style={styles.tryOnButtonText}>Try On</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.addToCartButton,
            !selectedSize && styles.disabledButton
          ]}
          onPress={handleAddToBag}
          disabled={!selectedSize}
        >
          <Icon name="shopping-bag" size={18} color="#FFF" />
          <Text style={styles.addToCartButtonText}>
            {selectedSize ? "Add To Bag" : "Select Size"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
    backgroundColor: '#f8f8f8',
  },
  productInfo: {
    padding: 16,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    color: '#333',
    fontWeight: '600',
    fontSize: 12,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountPercentage: {
    fontSize: 14,
    color: '#3CB371',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },
  sizeSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSizeButton: {
    borderColor: '#FF4089',
    backgroundColor: '#FFDCEA',
  },
  sizeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSizeText: {
    color: '#FF4089',
    fontWeight: '600',
  },
  detailsSection: {
    marginBottom: 100,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 14,
    color: '#777',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tryOnButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF4089',
    marginRight: 10,
  },
  tryOnButtonText: {
    marginLeft: 8,
    color: '#FF4089',
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#FF4089',
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  addToCartButtonText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProductDetailScreen; 