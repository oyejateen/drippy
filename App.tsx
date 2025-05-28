import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './utils/AuthContext';
import RootNavigator from './navigation';
import { LogBox } from 'react-native';

// Import for NativeWind
import './global.css';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Nativewind',
  'AsyncStorage has been extracted',
  'ShadowProps'
]);

const App = () => {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
