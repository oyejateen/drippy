import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { WalmartProduct, getAllWalmartProducts, searchWalmartProducts, getBestSellersByCategory, getTopRatedWalmartProducts, getDiscountedWalmartProducts } from '../utils/walmartDataSource';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  products?: WalmartProduct[];
  categorizedProducts?: {
    hiddenGems: WalmartProduct[];
    valueVault: WalmartProduct[];
    trendingNow: WalmartProduct[];
  };
}

interface CategorizedProducts {
  hiddenGems: WalmartProduct[];
  valueVault: WalmartProduct[];
  trendingNow: WalmartProduct[];
}

interface WalmartChatbotProps {
  onProductPress: (product: WalmartProduct) => void;
}

const WalmartChatbot: React.FC<WalmartChatbotProps> = ({ onProductPress }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [conversationStep, setConversationStep] = useState(0);

  // Quick suggestion buttons - Updated for hardcoded flow
  const quickSuggestions = [
    "Show me today's deals",
    "Best deals",
    "Today's offers",
    "Clothing products",
    "Fashion items",
    "Lipstick options",
    "Beauty products"
  ];

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      text: "Hi! I'm your Walmart shopping assistant. I can help you find products, get recommendations, and answer questions about our inventory. What are you looking for today?",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setConversationStep(0);
  }, []);

  // Animate modal
  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  // Check if query is category-related
  const isCategoryQuery = (query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    const categoryKeywords = [
      'beauty', 'makeup', 'skincare', 'cosmetics',
      'clothing', 'clothes', 'fashion', 'apparel',
      'electronics', 'tech', 'gadgets', 'tv', 'phone',
      'home', 'decor', 'furniture', 'kitchen',
      'shoes', 'footwear', 'sneakers', 'boots',
      'sports', 'fitness', 'exercise',
      'toys', 'games', 'entertainment',
      'books', 'stationery', 'office',
      'automotive', 'car', 'vehicle',
      'garden', 'outdoor', 'lawn'
    ];
    return categoryKeywords.some(keyword => lowerQuery.includes(keyword));
  };

  const findRelevantProducts = (query: string): WalmartProduct[] => {
    const lowerQuery = query.toLowerCase();
    
    // Check for specific product types
    if (lowerQuery.includes('beauty') || lowerQuery.includes('makeup')) {
      return getBestSellersByCategory('Beauty', 5);
    }
    if (lowerQuery.includes('home') || lowerQuery.includes('decor')) {
      return getBestSellersByCategory('Home', 5);
    }
    if (lowerQuery.includes('clothing') || lowerQuery.includes('clothes')) {
      return getBestSellersByCategory('Clothing', 5);
    }
    if (lowerQuery.includes('electronics') || lowerQuery.includes('tv')) {
      return getBestSellersByCategory('Electronics', 5);
    }
    if (lowerQuery.includes('shoes') || lowerQuery.includes('footwear')) {
      return getBestSellersByCategory('Shoes', 5);
    }
    if (lowerQuery.includes('discount') || lowerQuery.includes('sale') || lowerQuery.includes('deal')) {
      return getDiscountedWalmartProducts().slice(0, 5);
    }
    if (lowerQuery.includes('top') || lowerQuery.includes('best')) {
      return getTopRatedWalmartProducts(5);
    }
    
    // General search
    return searchWalmartProducts(query).slice(0, 5);
  };

  const categorizeProducts = (query: string): CategorizedProducts => {
    const lowerQuery = query.toLowerCase();
    let categoryProducts: WalmartProduct[] = [];
    
    // Determine category based on query
    if (lowerQuery.includes('beauty') || lowerQuery.includes('makeup') || lowerQuery.includes('skincare')) {
      categoryProducts = getAllWalmartProducts().filter(p => p.category === 'Beauty');
    } else if (lowerQuery.includes('clothing') || lowerQuery.includes('clothes') || lowerQuery.includes('fashion')) {
      categoryProducts = getAllWalmartProducts().filter(p => p.category === 'Clothing');
    } else if (lowerQuery.includes('electronics') || lowerQuery.includes('tech') || lowerQuery.includes('tv')) {
      categoryProducts = getAllWalmartProducts().filter(p => p.category === 'Electronics');
    } else if (lowerQuery.includes('home') || lowerQuery.includes('decor') || lowerQuery.includes('furniture')) {
      categoryProducts = getAllWalmartProducts().filter(p => p.category === 'Home');
    } else if (lowerQuery.includes('shoes') || lowerQuery.includes('footwear')) {
      categoryProducts = getAllWalmartProducts().filter(p => p.category === 'Shoes');
    } else {
      // For general category queries, get all products
      categoryProducts = getAllWalmartProducts();
    }

    // Categorize products
    const hiddenGems = categoryProducts
      .filter(p => p.rating >= 4.5 && p.reviewCount >= 100)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    const valueVault = categoryProducts
      .filter(p => p.price && p.finalPrice && parseFloat(p.price.replace('$', '')) > parseFloat(p.finalPrice.replace('$', ''))) // Products with discounts
      .sort((a, b) => {
        const discountA = parseFloat(a.price.replace('$', '')) - parseFloat(a.finalPrice.replace('$', ''));
        const discountB = parseFloat(b.price.replace('$', '')) - parseFloat(b.finalPrice.replace('$', ''));
        return discountB - discountA;
      })
      .slice(0, 3);

    const trendingNow = categoryProducts
      .filter(p => p.reviewCount >= 50)
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 3);

    return {
      hiddenGems,
      valueVault,
      trendingNow
    };
  };

  const getHardcodedResponse = (userMessage: string, step: number): { text: string; products?: WalmartProduct[]; categorizedProducts?: CategorizedProducts } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Step 0: User clicks "Show me today's deals" or similar
    if (step === 0 && (lowerMessage.includes('deal') || lowerMessage.includes('best') || lowerMessage.includes('today') || lowerMessage.includes('offer'))) {
      return {
        text: "Here are today's best deals! I've found some amazing offers just for you. These are our top picks with the biggest savings and highest customer satisfaction.",
        products: getDiscountedWalmartProducts().slice(0, 5)
      };
    }
    
    // Step 1: User asks for clothing products
    if (step === 1 && (lowerMessage.includes('clothing') || lowerMessage.includes('clothes') || lowerMessage.includes('fashion') || lowerMessage.includes('apparel'))) {
      return {
        text: "Great choice! I've organized our clothing collection into three categories to help you find exactly what you're looking for. Check out our hidden gems, value vault deals, and trending styles!",
        categorizedProducts: categorizeProducts('clothing')
      };
    }
    
    // Step 2: User asks for lipstick
    if (step === 2 && (lowerMessage.includes('lipstick') || lowerMessage.includes('beauty') || lowerMessage.includes('makeup'))) {
      return {
        text: "Perfect! Here are some amazing lipstick options for you. I've selected the best-rated and most popular lipsticks with great reviews and competitive prices.",
        products: getAllWalmartProducts().filter(p => p.title.toLowerCase().includes('lipstick')).slice(0, 5)
      };
    }
    
    // Default response for any other message
    return {
      text: "I'm here to help you find great products! Try asking about specific categories like clothing, beauty, electronics, or today's deals."
    };
  };

  const handleSendMessage = async (message?: string) => {
    const textToSend = message || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const response = getHardcodedResponse(textToSend, conversationStep);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        products: response.products,
        categorizedProducts: response.categorizedProducts
      };

      console.log('Adding bot message:', botMessage);
      setMessages(prev => {
        const newMessages = [...prev, botMessage];
        console.log('Total messages:', newMessages.length);
        return newMessages;
      });
      setConversationStep(prev => prev + 1);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Chat Button - Bottom Right */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setIsVisible(true)}
      >
        <MaterialIcons name="chat" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View
            style={[
              styles.modalContent,
              { opacity: fadeAnim }
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerInfo}>
                <View style={styles.avatar}>
                  <MaterialIcons name="smart-toy" size={24} color="#FF385C" />
                </View>
                <View>
                  <Text style={styles.headerTitle}>Walmart Assistant</Text>
                  <Text style={styles.headerSubtitle}>Online • Ready to help</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => {
                    const welcomeMessage: ChatMessage = {
                      id: 'welcome',
                      text: "Hi! I'm your Walmart shopping assistant. I can help you find products, get recommendations, and answer questions about our inventory. What are you looking for today?",
                      isUser: false,
                      timestamp: new Date()
                    };
                    setMessages([welcomeMessage]);
                    setConversationStep(0);
                  }}
                >
                  <MaterialIcons name="refresh" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsVisible(false)}
                >
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() => {
                console.log('Content size changed, scrolling to end');
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              removeClippedSubviews={false}
            >
              {messages.map((message, index) => (
                <View key={message.id} style={[
                  styles.messageContainer,
                  message.isUser ? styles.userMessage : styles.botMessage
                ]}>
                  <View style={[
                    styles.messageBubble,
                    message.isUser ? styles.userBubble : styles.botBubble
                  ]}>
                    <Text style={[
                      styles.messageText,
                      message.isUser ? styles.userText : styles.botText
                    ]}>
                      {message.text}
                    </Text>
                  </View>

                  {message.products && message.products.length > 0 && (
                    <View style={styles.productsContainer}>
                      <Text style={styles.productsTitle}>Here are some recommendations:</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={true}
                        style={{ height: 200 }} // Reduced height for the horizontal ScrollView
                        contentContainerStyle={styles.productsListContent}
                      >
                        {message.products.map((product) => (
                          <TouchableOpacity
                            key={product.id}
                            style={styles.productCard}
                            onPress={() => onProductPress(product)}
                          >
                            <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                            <View style={styles.productInfo}>
                              <Text style={styles.productTitle} numberOfLines={2}>
                                {product.title}
                              </Text>
                              <Text style={styles.productBrand}>{product.brand}</Text>
                              <View style={styles.productPriceRow}>
                                <Text style={styles.productPrice}>{product.finalPrice}</Text>
                                {product.price !== product.finalPrice && (
                                  <Text style={styles.originalPrice}>{product.price}</Text>
                                )}
                              </View>
                              <View style={styles.ratingRow}>
                                <MaterialIcons name="star" size={16} color="#FFD700" />
                                <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                                <Text style={styles.reviewCount}>({product.reviewCount})</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  {message.categorizedProducts && (
                    <View style={styles.categorizedProductsContainer}>
                      {/* Hidden Gems Section */}
                      {message.categorizedProducts.hiddenGems.length > 0 && (
                        <View style={styles.categorySection}>
                          <View style={styles.categoryHeader}>
                            <Text style={styles.categoryEmoji}>💎</Text>
                            <Text style={styles.categoryTitle}>Hidden Gems</Text>
                          </View>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ height: 200 }} // Reduced height for the horizontal ScrollView
                            contentContainerStyle={styles.productsListContent}
                          >
                            {message.categorizedProducts.hiddenGems.map((product) => (
                              <TouchableOpacity
                                key={product.id}
                                style={styles.productCard}
                                onPress={() => onProductPress(product)}
                              >
                                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                                <View style={styles.productInfo}>
                                  <Text style={styles.productTitle} numberOfLines={2}>
                                    {product.title}
                                  </Text>
                                  <Text style={styles.productBrand}>{product.brand}</Text>
                                  <View style={styles.productPriceRow}>
                                    <Text style={styles.productPrice}>{product.finalPrice}</Text>
                                    {product.price !== product.finalPrice && (
                                      <Text style={styles.originalPrice}>{product.price}</Text>
                                    )}
                                  </View>
                                  <View style={styles.ratingRow}>
                                    <MaterialIcons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                                    <Text style={styles.reviewCount}>({product.reviewCount})</Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}

                      {/* Value Vault Section */}
                      {message.categorizedProducts.valueVault.length > 0 && (
                        <View style={styles.categorySection}>
                          <View style={styles.categoryHeader}>
                            <Text style={styles.categoryEmoji}>💰</Text>
                            <Text style={styles.categoryTitle}>Value Vault</Text>
                          </View>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ height: 200 }} // Reduced height for the horizontal ScrollView
                            contentContainerStyle={styles.productsListContent}
                          >
                            {message.categorizedProducts.valueVault.map((product) => (
                              <TouchableOpacity
                                key={product.id}
                                style={styles.productCard}
                                onPress={() => onProductPress(product)}
                              >
                                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                                <View style={styles.productInfo}>
                                  <Text style={styles.productTitle} numberOfLines={2}>
                                    {product.title}
                                  </Text>
                                  <Text style={styles.productBrand}>{product.brand}</Text>
                                  <View style={styles.productPriceRow}>
                                    <Text style={styles.productPrice}>{product.finalPrice}</Text>
                                    {product.price !== product.finalPrice && (
                                      <Text style={styles.originalPrice}>{product.price}</Text>
                                    )}
                                  </View>
                                  <View style={styles.ratingRow}>
                                    <MaterialIcons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                                    <Text style={styles.reviewCount}>({product.reviewCount})</Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}

                      {/* Trending Now Section */}
                      {message.categorizedProducts.trendingNow.length > 0 && (
                        <View style={styles.categorySection}>
                          <View style={styles.categoryHeader}>
                            <Text style={styles.categoryEmoji}>📈</Text>
                            <Text style={styles.categoryTitle}>Trending Now</Text>
                          </View>
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ height: 200 }} // Reduced height for the horizontal ScrollView
                            contentContainerStyle={styles.productsListContent}
                          >
                            {message.categorizedProducts.trendingNow.map((product) => (
                              <TouchableOpacity
                                key={product.id}
                                style={styles.productCard}
                                onPress={() => onProductPress(product)}
                              >
                                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                                <View style={styles.productInfo}>
                                  <Text style={styles.productTitle} numberOfLines={2}>
                                    {product.title}
                                  </Text>
                                  <Text style={styles.productBrand}>{product.brand}</Text>
                                  <View style={styles.productPriceRow}>
                                    <Text style={styles.productPrice}>{product.finalPrice}</Text>
                                    {product.price !== product.finalPrice && (
                                      <Text style={styles.originalPrice}>{product.price}</Text>
                                    )}
                                  </View>
                                  <View style={styles.ratingRow}>
                                    <MaterialIcons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
                                    <Text style={styles.reviewCount}>({product.reviewCount})</Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))}

              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <View style={styles.suggestionsContainer}>
                  <Text style={styles.suggestionsTitle}>Quick suggestions:</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.suggestionsList}
                  >
                    {quickSuggestions.map((suggestion) => (
                      <TouchableOpacity
                        key={suggestion}
                        style={styles.suggestionButton}
                        onPress={() => handleSendMessage(suggestion)}
                      >
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {isLoading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FF385C" />
                  <Text style={styles.loadingText}>Assistant is typing...</Text>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me about products, deals, or anything else..."
                placeholderTextColor="#999"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled
                ]}
                onPress={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
              >
                <MaterialIcons
                  name="send"
                  size={20}
                  color={(!inputText.trim() || isLoading) ? "#999" : "#FFFFFF"}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButton: {
    padding: 8,
    marginRight: 8,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 100, // Add extra padding at bottom
    flexGrow: 1, // Ensure content can grow
  },
  messageContainer: {
    marginBottom: 16,
    minHeight: 20, // Ensure minimum height for visibility
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#FF385C',
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#333',
  },
  suggestionsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  suggestionsList: {
    paddingRight: 16,
  },
  suggestionButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  suggestionText: {
    fontSize: 12,
    color: '#666',
  },
  productsContainer: {
    marginTop: 12,
    maxHeight: 280,
    // Removed maxHeight here, height is set directly on ScrollView
  },
  productsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  categorizedProductsContainer: {
    marginTop: 12,
    maxHeight: 920, // Reduce max height to prevent overflow
  },
  categorySection: {
    marginBottom: 16,
    maxHeight: 300, // Reduce height of each category section
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  categoryEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productsListContent: { // Renamed from productsList
    paddingRight: 16,
    // Removed maxHeight from here, height is set directly on ScrollView
  },
  productCard: {
    width: 160,
    height: 250, // Reduce height to make more compact
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
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    maxHeight: 32,
  },
  productBrand: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF385C',
  },
  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 2,
  },
  reviewCount: {
    fontSize: 11,
    color: '#999',
    marginLeft: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F8F8F8',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});

export default WalmartChatbot;