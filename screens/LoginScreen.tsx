import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { loginWithEmailAndPassword, registerUser, configureGoogleAuth } from '../utils/authService';
import { useAuth } from '../utils/AuthContext';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../utils/firebase';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { setCurrentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  
  // Set up Google Auth
  const [request, response, promptAsync] = configureGoogleAuth();
  
  // Handle Google Sign-In response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleSignIn(response.params.id_token);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken) => {
    try {
      setGoogleLoading(true);
      
      // Create credential with the token
      const credential = GoogleAuthProvider.credential(idToken);
      
      // Sign in with credential
      const result = await signInWithCredential(auth, credential);
      console.log("Google sign in successful:", result.user.email);
      setCurrentUser(result.user);
    } catch (error) {
      console.error("Google sign in error:", error);
      Alert.alert('Google Sign-In Error', 'Failed to sign in with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAuthentication = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      let user;
      if (isLogin) {
        // Login
        user = await loginWithEmailAndPassword(email, password);
      } else {
        // Register
        user = await registerUser(email, password);
      }
      console.log(`User ${isLogin ? 'logged in' : 'registered'} successfully:`, user.email);
      setCurrentUser(user);
    } catch (error: any) {
      console.error("Authentication error:", error);
      let errorMessage = 'Authentication failed. Please try again.';
      
      // Extract Firebase error message
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use. Please try logging in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please register first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      }
      
      Alert.alert('Authentication Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar style="light" />
        
        {/* Top Section */}
        <View style={styles.topSection}>
          <Text style={styles.titleText}>
            DRIPPY
          </Text>
          <Text style={styles.subtitleText}>
            {isLogin ? 'LOGIN TO CONTINUE' : 'CREATE ACCOUNT'}
          </Text>
        </View>
        
        {/* Login Section */}
        <View style={styles.middleSection}>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ABABAB"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#ABABAB"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleAuthentication}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
              </Text>
            </TouchableOpacity>
            
            {isLoading && <ActivityIndicator style={styles.loader} color="#FF2D55" />}
            
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>
            
            <TouchableOpacity 
              style={[styles.googleButton, googleLoading && styles.buttonDisabled]}
              onPress={() => {
                if (!request) {
                  Alert.alert('Google Sign-In', 'Google Sign-In is not ready yet. Please try again later.');
                  return;
                }
                promptAsync();
              }}
              disabled={googleLoading || !request}
            >
              {googleLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.googleButtonText}>
                  Continue with Google
                </Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.switchModeButton}
              onPress={() => setIsLogin(!isLogin)}
              disabled={isLoading || googleLoading}
            >
              <Text style={styles.switchModeText}>
                {isLogin ? 'New user? Sign up instead' : 'Already have an account? Log in'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={isLoading || googleLoading}
            >
              <Text style={styles.backButtonText}>Go back</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Terms Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.termsText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitleText: {
    color: '#0A84FF',
    fontSize: 18,
  },
  middleSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 320,
    backgroundColor: '#252525',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    color: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  button: {
    width: '100%',
    backgroundColor: '#FF2D55',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  switchModeButton: {
    marginTop: 20,
  },
  switchModeText: {
    color: '#0A84FF',
    fontSize: 16,
  },
  backButton: {
    marginTop: 16,
  },
  backButtonText: {
    color: '#FF2D55',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  bottomSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  termsText: {
    color: '#ABABAB',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  loader: {
    marginTop: 20,
  },
  dividerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333333',
  },
  dividerText: {
    color: '#ABABAB',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  googleButton: {
    width: '100%',
    backgroundColor: '#4285F4',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  }
});

export default LoginScreen; 