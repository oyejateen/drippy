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
import { MainStackParamList } from '../navigation';
import { MaterialIcons } from '@expo/vector-icons';
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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Create a random list of available sizes
  const availableSizes = React.useMemo(() => {
    const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    // Randomly select 3-5 sizes as available
    const numSizes = Math.floor(Math.random() * 3) + 3;
    const shuffled = [...allSizes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numSizes);
  }, [product.id]);
  
  // Create a random list of available colors
  const availableColors = React.useMemo(() => {
    const allColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple'];
    // Randomly select 3-5 colors as available
    const numColors = Math.floor(Math.random() * 3) + 3;
    const shuffled = [...allColors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numColors);
  }, [product.id]);
  
  const discountPercentage = React.useMemo(() => {
    if (!product.discountedPrice) return 0;
    
    const originalPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const discountedPrice = parseFloat(product.discountedPrice.replace(/[^0-9.]/g, ''));
    
    if (isNaN(originalPrice) || isNaN(discountedPrice)) return 0;
    
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }, [product.price, product.discountedPrice]);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };
  
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };
  
  const handleAddToBag = () => {
    // In a real app, this would add the product to cart
    alert(`Added ${product.title} (Size: ${selectedSize || 'Not selected'}, Color: ${selectedColor || 'Not selected'}) to bag`);
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
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
            <MaterialIcons 
              name={isFavorite ? "favorite" : "favorite-border"} 
              size={24} 
              color={isFavorite ? "#FF385C" : "#333"} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="share" size={22} color="#333" />
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
                <MaterialIcons name="star" size={14} color="#FFD700" />
                <Text style={styles.ratingText}>{product.rating}</Text>
                {product.reviewCount && (
                  <Text style={styles.reviewCount}>({product.reviewCount})</Text>
                )}
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
          
          {/* Delivery Options */}
          <View style={styles.deliverySection}>
            <View style={styles.deliveryOption}>
              <MaterialIcons name="local-shipping" size={20} color="#4CAF50" />
              <Text style={styles.deliveryText}>Free delivery on orders $35+</Text>
            </View>
            <View style={styles.deliveryOption}>
              <MaterialIcons name="store" size={20} color="#2196F3" />
              <Text style={styles.deliveryText}>Free pickup available</Text>
            </View>
          </View>
          
          {/* Tags */}
          <View style={styles.tagsContainer}>
            {product.tags.slice(0, 5).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          {/* Color Selection */}
          <View style={styles.colorSection}>
            <Text style={styles.sectionTitle}>Select Color</Text>
            <View style={styles.colorsContainer}>
              {availableColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    selectedColor === color && styles.selectedColorButton
                  ]}
                  onPress={() => handleColorSelect(color)}
                >
                  <Text 
                    style={[
                      styles.colorText,
                      selectedColor === color && styles.selectedColorText
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
            {product.description && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{product.description}</Text>
              </View>
            )}
          </View>
          
          {/* Return Policy */}
          <View style={styles.returnSection}>
            <MaterialIcons name="assignment-return" size={20} color="#666" />
            <Text style={styles.returnText}>Free 90-day returns</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.tryOnButton]}
          onPress={handleTryOn}
        >
          <MaterialIcons name="camera-alt" size={18} color="#FF385C" />
          <Text style={styles.tryOnButtonText}>Try On</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.addToCartButton
          ]}
          onPress={handleAddToBag}
        >
          <MaterialIcons name="shopping-cart" size={18} color="#FFF" />
          <Text style={styles.addToCartButtonText}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#F8F8F8',
  },
  productInfo: {
    padding: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brandText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    lineHeight: 26,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  discountedPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF385C',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 18,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountPercentage: {
    fontSize: 14,
    color: '#FF385C',
    fontWeight: '600',
  },
  deliverySection: {
    marginBottom: 16,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  colorSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedColorButton: {
    borderColor: '#FF385C',
    backgroundColor: '#FF385C',
  },
  colorText: {
    fontSize: 14,
    color: '#333',
  },
  selectedColorText: {
    color: '#FFFFFF',
  },
  sizeSection: {
    marginBottom: 20,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedSizeButton: {
    borderColor: '#FF385C',
    backgroundColor: '#FF385C',
  },
  sizeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSizeText: {
    color: '#FFFFFF',
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  returnSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  returnText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tryOnButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF385C',
  },
  tryOnButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF385C',
    marginLeft: 8,
  },
  addToCartButton: {
    backgroundColor: '#FF385C',
  },
  addToCartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
});

export default ProductDetailScreen; 