import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../utils/AuthContext';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Product } from '../utils/dataSource';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import HaulScreen from '../screens/HaulScreen';
import TryingRoomScreen from '../screens/TryingRoomScreen';
import WardrobeScreen from '../screens/WardrobeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

// Define navigation types
export type MainStackParamList = {
  Auth: undefined;
  Main: undefined;
  Welcome: undefined;
  Login: undefined;
  Haul: undefined;
  TryingRoom: { product?: Product };
  Wardrobe: undefined;
  ProductDetail: { product: Product };
};

// Loading screen component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#FF2D55" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator (Bottom Tabs)
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#FF385C',
        tabBarInactiveTintColor: '#ABABAB',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Haul" 
        component={HaulScreen} 
        options={{
          tabBarLabel: 'Shop',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="shopping-bag" 
              size={focused ? 28 : 24} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="TryingRoom" 
        component={TryingRoomScreen} 
        options={{
          tabBarLabel: 'Try On',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="camera-alt" 
              size={focused ? 28 : 24} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen 
        name="Wardrobe" 
        component={WardrobeScreen} 
        options={{
          tabBarLabel: 'Wardrobe',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="checkroom" 
              size={focused ? 28 : 24} 
              color={color} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Auth Stack (Welcome, Login)
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS, // Use predefined transition preset
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const { currentUser, isLoading } = useAuth();

  // If still checking auth state, show loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen} 
              options={{
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
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
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  placeholderIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderIconText: {
    fontSize: 40,
  },
  placeholderTitle: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  placeholderSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default RootNavigator; 