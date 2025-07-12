import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Modal,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../utils/AuthContext';

// Type definitions
interface SavedOutfit {
  id: string;
  name: string;
  imageUrl: string;
  date: string;
  category: string;
}

// Placeholder data for initial development
const PLACEHOLDER_OUTFITS: SavedOutfit[] = [
  {
    id: '1',
    name: 'Summer Look',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    date: '2023-06-15',
    category: 'Summer'
  },
  {
    id: '2',
    name: 'Casual Friday',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop',
    date: '2023-05-20',
    category: 'Casual'
  },
  {
    id: '3',
    name: 'Party Night',
    imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop',
    date: '2023-04-10',
    category: 'Party'
  },
  {
    id: '4',
    name: 'Work Meeting',
    imageUrl: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1000&auto=format&fit=crop',
    date: '2023-03-25',
    category: 'Formal'
  },
  {
    id: '5',
    name: 'Winter Style',
    imageUrl: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?q=80&w=1000&auto=format&fit=crop',
    date: '2023-01-15',
    category: 'Winter'
  },
  {
    id: '6',
    name: 'Beach Day',
    imageUrl: 'https://images.unsplash.com/photo-1602185155224-a02767cc84a3?q=80&w=1000&auto=format&fit=crop',
    date: '2023-07-08',
    category: 'Summer'
  },
];

// Available categories
const OUTFIT_CATEGORIES = [
  'All',
  'Casual',
  'Formal',
  'Party',
  'Summer',
  'Winter'
];

const WardrobeScreen = () => {
  const { currentUser } = useAuth();
  
  // State variables
  const [outfits, setOutfits] = useState<SavedOutfit[]>(PLACEHOLDER_OUTFITS);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<SavedOutfit | null>(null);
  
  // Fetch outfits from database (simulated)
  const fetchOutfits = async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      setTimeout(() => {
        // Filter outfits by category if needed
        if (selectedCategory === 'All') {
          setOutfits(PLACEHOLDER_OUTFITS);
        } else {
          const filtered = PLACEHOLDER_OUTFITS.filter(
            outfit => outfit.category === selectedCategory
          );
          setOutfits(filtered);
        }
        setLoading(false);
      }, 1000);
      
      // TODO: Implement actual Firestore query
      // const outfitsRef = collection(db, "users", currentUser.uid, "outfits");
      // const q = query(outfitsRef, where("category", "==", selectedCategory));
      // const querySnapshot = await getDocs(q);
      // const outfitData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // setOutfits(outfitData);
      
    } catch (error) {
      console.error('Error fetching outfits:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load your wardrobe. Please try again.');
    }
  };

  // Delete outfit
  const deleteOutfit = (outfitId: string) => {
    Alert.alert(
      'Delete Outfit',
      'Are you sure you want to delete this outfit?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Filter out the deleted outfit
            const updatedOutfits = outfits.filter(outfit => outfit.id !== outfitId);
            setOutfits(updatedOutfits);
            setDetailModalVisible(false);
            
            // TODO: Implement actual Firestore delete
            // const outfitRef = doc(db, "users", currentUser.uid, "outfits", outfitId);
            // await deleteDoc(outfitRef);
          },
        },
      ]
    );
  };
  
  // Initial data fetch
  useEffect(() => {
    fetchOutfits();
  }, []);
  
  // Fetch outfits when category changes
  useEffect(() => {
    fetchOutfits();
  }, [selectedCategory]);
  
  // Open detail modal
  const openOutfitDetail = (outfit: SavedOutfit) => {
    setSelectedOutfit(outfit);
    setDetailModalVisible(true);
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render outfit card
  const renderOutfit = ({ item }: { item: SavedOutfit }) => (
    <TouchableOpacity 
      style={styles.outfitCard}
      onPress={() => openOutfitDetail(item)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.outfitImage} 
        resizeMode="cover"
      />
      <View style={styles.outfitInfo}>
        <Text style={styles.outfitName}>{item.name}</Text>
        <Text style={styles.outfitCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );
  
  // Render category pill
  const renderCategory = (category: string) => (
    <TouchableOpacity 
      key={category}
      style={[
        styles.categoryPill, 
        selectedCategory === category && styles.selectedCategoryPill
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text 
        style={[
          styles.categoryText, 
          selectedCategory === category && styles.selectedCategoryText
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wardrobe</Text>
        <Text style={styles.headerSubtitle}>Your Saved Outfits</Text>
      </View>
      
      {/* Categories Filter */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={OUTFIT_CATEGORIES}
          renderItem={({ item }) => renderCategory(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      {/* Outfits Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF385C" />
          <Text style={styles.loadingText}>Loading your wardrobe...</Text>
        </View>
      ) : outfits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No outfits found.</Text>
          <Text style={styles.emptySubtext}>
            Try on some clothes in the Trying Room and save them to your wardrobe!
          </Text>
        </View>
      ) : (
        <FlatList
          data={outfits}
          renderItem={renderOutfit}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.outfitsGrid}
        />
      )}
      
      {/* Outfit Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedOutfit && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedOutfit.name}</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setDetailModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <Image 
                  source={{ uri: selectedOutfit.imageUrl }} 
                  style={styles.detailImage} 
                  resizeMode="contain"
                />
                
                <View style={styles.detailInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Category:</Text>
                    <Text style={styles.infoValue}>{selectedOutfit.category}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Saved on:</Text>
                    <Text style={styles.infoValue}>{formatDate(selectedOutfit.date)}</Text>
                  </View>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => deleteOutfit(selectedOutfit.id)}
                  >
                    <Text style={styles.buttonText}>Delete Outfit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 70 : 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF385C',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#333333',
    letterSpacing: 3,
  },
  categoriesContainer: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategoryPill: {
    backgroundColor: '#7209B7',
  },
  categoryText: {
    color: '#333333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  outfitsGrid: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  outfitCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  outfitImage: {
    width: '100%',
    height: 200,
  },
  outfitInfo: {
    padding: 12,
  },
  outfitName: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
  },
  outfitCategory: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#333333',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  detailImage: {
    width: '100%',
    height: 350,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailInfo: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#999',
    fontSize: 14,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF385C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default WardrobeScreen; 