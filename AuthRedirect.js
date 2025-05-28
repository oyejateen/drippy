// This file is used as a simple redirect page for Expo auth in the web browser
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AuthRedirect() {
  useEffect(() => {
    // This helps ensure the browser closes after authentication
    // and the app properly receives the authentication response
    if (window) {
      window.close();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Authentication complete!</Text>
      <Text style={styles.subText}>You can close this window and return to the app.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subText: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
}); 