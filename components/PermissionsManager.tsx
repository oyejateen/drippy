import React, { useEffect, useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PermissionStatus {
  camera: boolean | null;
  mediaLibrary: boolean | null;
  location: boolean | null;
}

interface PermissionsManagerProps {
  onPermissionsResolved: () => void;
}

const PermissionsManager: React.FC<PermissionsManagerProps> = ({ onPermissionsResolved }) => {
  const [status, setStatus] = useState<PermissionStatus>({
    camera: null,
    mediaLibrary: null,
    location: null,
  });
  const [loading, setLoading] = useState(true);
  const [hasCheckedBefore, setHasCheckedBefore] = useState(false);

  // Check if we've shown the permissions screen before
  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const value = await AsyncStorage.getItem('permissions_shown');
        if (value !== null) {
          setHasCheckedBefore(true);
          // If we've shown this before, just resolve right away
          // The individual screens will handle their specific permissions
          onPermissionsResolved();
        } else {
          // First time, so request permissions
          requestPermissions();
        }
      } catch (error) {
        console.error('Error checking first time status:', error);
        // Fallback to requesting permissions anyway
        requestPermissions();
      }
    };

    checkFirstTime();
  }, []);

  // Request camera permissions specifically
  const requestCameraPermission = async () => {
    try {
      console.log('Explicitly requesting camera permission...');
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission result:', status);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  };

  // Request media library permissions specifically
  const requestMediaLibraryPermission = async () => {
    try {
      console.log('Explicitly requesting media library permission...');
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log('Media library permission result:', status);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      return false;
    }
  };

  // Request location permissions specifically
  const requestLocationPermission = async () => {
    try {
      console.log('Explicitly requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission result:', status);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  const requestPermissions = async () => {
    setLoading(true);
    try {
      // Sequential permission requests for better user experience
      // Request camera permission
      const cameraGranted = await requestCameraPermission();
      
      // Request media library permission
      const mediaLibraryGranted = await requestMediaLibraryPermission();
      
      // Request location permission
      const locationGranted = await requestLocationPermission();
      
      // Update statuses
      const updatedStatus = {
        camera: cameraGranted,
        mediaLibrary: mediaLibraryGranted,
        location: locationGranted
      };
      
      setStatus(updatedStatus);
      
      // Save that we've shown this screen
      await AsyncStorage.setItem('permissions_shown', 'true');
      
      console.log('Permission status summary:', updatedStatus);
      
      // If essential permissions are granted, continue immediately
      if (cameraGranted && mediaLibraryGranted) {
        onPermissionsResolved();
      } else {
        // If any critical permission was denied, leave the screen visible for user to see
        console.log('Some critical permissions were denied');
      }
    } catch (error) {
      console.error('Error in permission request flow:', error);
      // Continue anyway if there's an error
      onPermissionsResolved();
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    onPermissionsResolved();
  };

  // If already checked, or loading, show a loading spinner
  if (hasCheckedBefore || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF385C" />
        <Text style={styles.loadingText}>
          {loading ? 'Requesting permissions...' : 'Loading...'}
        </Text>
      </View>
    );
  }

  // If any essential permissions are denied, show instructions
  const hasAnyCriticalPermissionDenied = 
    status.camera === false || 
    status.mediaLibrary === false;

  return (
    <View style={styles.container}>
      <MaterialIcons 
        name={hasAnyCriticalPermissionDenied ? "error-outline" : "check-circle-outline"} 
        size={60} 
        color={hasAnyCriticalPermissionDenied ? "#FF385C" : "#4CC9F0"} 
      />
      
      <Text style={styles.title}>
        {hasAnyCriticalPermissionDenied 
          ? "Permissions Required" 
          : "Permissions Granted"}
      </Text>
      
      <Text style={styles.description}>
        {hasAnyCriticalPermissionDenied 
          ? "DRIPPY needs camera and photo access to let you try on clothes virtually." 
          : "Thank you! You're all set to use DRIPPY's virtual try-on features."}
      </Text>
      
      <View style={styles.permissionList}>
        <View style={styles.permissionItem}>
          <MaterialIcons 
            name={status.camera ? "check-circle" : "cancel"} 
            size={24} 
            color={status.camera ? "#4CC9F0" : "#FF385C"} 
          />
          <Text style={styles.permissionText}>
            Camera {status.camera ? "(Granted)" : "(Denied)"}
          </Text>
        </View>
        
        <View style={styles.permissionItem}>
          <MaterialIcons 
            name={status.mediaLibrary ? "check-circle" : "cancel"} 
            size={24} 
            color={status.mediaLibrary ? "#4CC9F0" : "#FF385C"} 
          />
          <Text style={styles.permissionText}>
            Photos {status.mediaLibrary ? "(Granted)" : "(Denied)"}
          </Text>
        </View>
        
        <View style={styles.permissionItem}>
          <MaterialIcons 
            name={status.location ? "check-circle" : "warning"} 
            size={24} 
            color={status.location ? "#4CC9F0" : "#FFC107"} 
          />
          <Text style={styles.permissionText}>
            Location {status.location ? "(Granted)" : "(Optional)"}
          </Text>
        </View>
      </View>
      
      {hasAnyCriticalPermissionDenied && (
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => {
            // Try requesting permissions again
            requestPermissions();
          }}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={[
          styles.continueButton, 
          hasAnyCriticalPermissionDenied && styles.continueButtonWarning
        ]}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>
          {hasAnyCriticalPermissionDenied 
            ? "Continue Anyway" 
            : "Enter DRIPPY"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionList: {
    width: '100%',
    marginBottom: 30,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  permissionText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  settingsButton: {
    backgroundColor: '#7209B7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
  },
  continueButton: {
    backgroundColor: '#4CC9F0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  continueButtonWarning: {
    backgroundColor: '#FF385C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
});

export default PermissionsManager; 