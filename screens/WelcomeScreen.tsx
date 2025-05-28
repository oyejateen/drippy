import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.titleText}>
          DRIPPY
        </Text>
        <Text style={styles.subtitleText}>
          VIRTUAL TRY-ON
        </Text>
      </View>
      
      {/* Middle Image Section */}
      <View style={styles.middleSection}>
        <View style={styles.imageContainer}>
          <Text style={styles.imageText}>
            Fashion Icon
          </Text>
        </View>
      </View>
      
      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Try on the latest clothes with AI before you buy
          </Text>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitleText: {
    color: '#FF2D55',
    fontSize: 20,
  },
  middleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: 280,
    height: 280,
    backgroundColor: '#1E1E1E',
    borderWidth: 2,
    borderColor: 'rgba(255, 45, 85, 0.3)',
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    color: '#FF2D55',
    fontSize: 28,
    fontWeight: 'bold',
  },
  bottomSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 64,
  },
  card: {
    width: 320,
    backgroundColor: '#252525',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 22,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 30,
  },
  button: {
    width: '100%',
    backgroundColor: '#FF2D55',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen; 