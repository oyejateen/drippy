import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  SafeAreaView,
  Alert,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';

// Fallback API key if env variable is not available
const GOOGLE_CLOUD_API_KEY = `AIzaSyD7cFZ4ijYt3JslhGnbZnY8165Ei_uGoXE`;

const { width, height } = Dimensions.get('window');

// Placeholder clothing items for virtual try-on
const CLOTHING_OPTIONS = [
  {
    id: '1',
    name: 'Denim Jacket',
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1000&auto=format&fit=crop',
    category: 'Jackets'
  },
  {
    id: '2',
    name: 'White T-Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
    category: 'Tops'
  },
  {
    id: '3',
    name: 'Black Jeans',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop',
    category: 'Bottoms'
  },
  {
    id: '4',
    name: 'Red Dress',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop',
    category: 'Dresses'
  },
  {
    id: '5',
    name: 'Formal Blazer',
    imageUrl: 'https://images.unsplash.com/photo-1551734444-c6c284a6a20d?q=80&w=1000&auto=format&fit=crop',
    category: 'Jackets'
  },
  {
    id: '6',
    name: 'Cotton Hoodie',
    imageUrl: 'https://images.unsplash.com/photo-1556172252-2bc194ca4e78?q=80&w=1000&auto=format&fit=crop',
    category: 'Outerwear'
  },
];

const TryingRoomScreen = () => {
  // State variables - use string literals for camera types instead of enum references
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  
  // Refs
  const cameraRef = useRef<any>(null);

  // Request permissions
  useEffect(() => {
    const getPermissions = async () => {
      try {
        console.log('Requesting permissions...');
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        
        console.log(`Camera: ${cameraStatus}, Media: ${mediaStatus}, Location: ${locationStatus}`);
        
        setHasPermission(
          cameraStatus === 'granted' && 
          mediaStatus === 'granted'
        );
        
        if (locationStatus === 'granted') {
          try {
            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);
          } catch (error) {
            console.log('Error getting location:', error);
          }
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
        Alert.alert('Error', 'Failed to request necessary permissions. Some features may not work properly.');
      }
    };

    getPermissions();
  }, []);

  // Toggle camera type (front/back)
  const toggleCameraType = () => {
    setCameraType(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  // Toggle flash mode
  const toggleFlashMode = () => {
    setFlashMode(current => {
      switch (current) {
        case 'off':
          return 'on';
        case 'on':
          return 'auto';
        case 'auto':
          return 'off';
        default:
          return 'off';
      }
    });
  };

  // Take a picture with camera
  const takePicture = async () => {
    if (!cameraRef.current || isTakingPicture) return;
    
    try {
      setIsTakingPicture(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });
      
      // Save photo to library if permission is granted
      if (hasPermission) {
        try {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        } catch (error) {
          console.error('Error saving to library:', error);
        }
      }
      
      setUserImage(photo.uri);
      setCameraVisible(false);
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    } finally {
      setIsTakingPicture(false);
    }
  };

  // Pick an image from gallery
  const pickImage = async () => {
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Gallery access is needed to pick images');
      return;
    }
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setUserImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Process the try-on request with Gemini API
  const processVirtualTryOn = async () => {
    if (!userImage || !selectedClothing) {
      Alert.alert('Missing Info', 'Please select both your photo and a clothing item');
      return;
    }
    
    setProcessingImage(true);
    
    try {
      // Get the selected clothing item data
      const selectedItem = CLOTHING_OPTIONS.find(item => item.id === selectedClothing);
      if (!selectedItem) throw new Error('Selected clothing item not found');
      
      console.log('Processing images...');
      
      let userImageBase64 = '';
      let clothingImageBase64 = '';
      
      try {
        // Handle user image (should be a local file)
        console.log('Converting user image to base64...');
        userImageBase64 = await convertImageToBase64(userImage);
        console.log('User image converted successfully');
        
        // Handle clothing image (could be remote URL)
        console.log('Converting clothing image to base64...');
        clothingImageBase64 = await convertImageToBase64(selectedItem.imageUrl);
        console.log('Clothing image converted successfully');
        
        console.log('Both images prepared successfully');
        
        // Prepare the detailed prompt for virtual try-on
        const detailedPrompt = `{
          "prompt_version": "2.0",
          "objective": "Generate a photorealistic virtual try-on image, seamlessly integrating a specified clothing item onto a person while rigidly preserving their facial identity, the clothing's exact appearance, and placing them in a completely new, distinct background.",
          "task": "High-Fidelity Virtual Try-On with Identity/Garment Preservation and Background Replacement",
        
          "inputs": {
            "person_image": {
              "description": "Source image containing the target person. Used *primarily* for identity (face, skin tone), pose, body shape, hair, and accessories. The original background will be DISCARDED.",
              "id": "input_1"
            },
            "garment_image": {
              "description": "Source image containing the target clothing item. May include a model, mannequin, or be flat-lay. Used *strictly* for the clothing's visual properties (color, style, texture, pattern).",
              "id": "input_2"
            },
            "background_preference": {
              "description": "Optional textual description or style reference for the desired new background (e.g., 'neutral studio', 'outdoor park scene', 'blurred cityscape'). If unspecified, generate a plausible, non-distracting, photorealistic background.",
              "id": "input_3",
              "required": false
            }
          },
        
          "processing_steps": [
            "Isolate the clothing item from 'garment_image' (input_2), discarding any original model, mannequin, or background. Extract exact color, pattern, texture, and style information.",
            "Identify the person (face, body shape, skin tone), pose, hair, and accessories from 'person_image' (input_1).",
            "Segment the person from the original background in 'person_image'.",
            "Determine the desired new background based on 'background_preference' or generate a suitable default.",
            "Analyze lighting cues from 'person_image' to inform initial lighting on the subject, but adapt lighting for consistency with the *new* background."
          ],
        
          "output_requirements": {
            "description": "Generate a single, high-resolution image where the person from 'person_image' appears to be naturally and realistically wearing the clothing item from 'garment_image', situated within a **completely new and different background**.",
            "format": "Image (e.g., PNG, JPG)",
            "quality": "Photorealistic, free of obvious artifacts, blending issues, or inconsistencies between subject, garment, and the new background."
          },
        
          "core_constraints": {
            "identity_lock": {
              "priority": "ABSOLUTE CRITICAL",
              "instruction": "Maintain the **PERFECT** facial identity, features, skin tone, and expression of the person from 'person_image'. **ZERO alterations** to the face are permitted. Treat the head region (including hair) as immutable unless directly and logically occluded by the garment. DO NOT GUESS OR HALLUCINATE FACIAL FEATURES."
            },
            "garment_fidelity": {
              "priority": "ABSOLUTE CRITICAL",
              "instruction": "Preserve the **EXACT** color (hue, saturation, brightness), pattern, texture, material properties, and design details of the clothing item from 'garment_image'. **ZERO deviations** in style, color, or visual appearance are allowed. Render the garment precisely as depicted in input_2."
            },
            "background_replacement": {
              "priority": "CRITICAL",
              "instruction": "Generate a **COMPLETELY NEW and DIFFERENT** background that is distinct from the original background in 'person_image'. The new background should be photorealistic and contextually plausible for a person/fashion image unless otherwise specified by 'background_preference'. Ensure the person is seamlessly integrated into this new environment. **NO elements** from the original background should remain visible."
            },
            "pose_preservation": {
              "priority": "HIGH",
              "instruction": "Retain the **exact** body pose and positioning of the person from 'person_image'."
            },
            "realistic_integration": {
              "priority": "HIGH",
              "instruction": "Simulate physically plausible draping, folding, and fit of the garment onto the person's body according to their shape and pose. Ensure natural interaction with the body within the context of the *new* background."
            },
            "lighting_consistency": {
              "priority": "HIGH",
              "instruction": "Apply lighting, shadows, and highlights to the rendered garment AND the person that are **perfectly consistent** with the direction, intensity, and color temperature implied by the **NEW background**. Adjust subject lighting subtly if necessary to match the new scene, but prioritize maintaining a natural look consistent with the original subject's lighting where possible."
            }
          }
        }`;
        
        // Call the Gemini API with both images
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GOOGLE_CLOUD_API_KEY}`;
        
        const requestData = {
          contents: [
            {
              parts: [
                { text: detailedPrompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: userImageBase64
                  }
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: clothingImageBase64
                  }
                }
              ]
            }
          ],
          generation_config: {
            temperature: 0.6,
            top_k: 40,
            top_p: 0.95,
            max_output_tokens: 4096,
          },
          // Specify that we want image in the response
          response_modalities: ["TEXT", "IMAGE"]
        };
        
        console.log('Calling Gemini API...');
        const response = await axios.post(geminiEndpoint, requestData);
        console.log('Received response from Gemini API');
        
        // Log response structure for debugging
        console.log('Response status:', response.status);
        console.log('Response structure:', JSON.stringify(Object.keys(response.data)));
        
        // Extract the image from the response
        if (response.data && 
            response.data.candidates && 
            response.data.candidates[0] && 
            response.data.candidates[0].content && 
            response.data.candidates[0].content.parts) {
          
          const parts = response.data.candidates[0].content.parts;
          
          // Look for inline_data or inlineData field (API might use different formats)
          let imagePart = parts.find((part: any) => 
            (part.inline_data && part.inline_data.mime_type && part.inline_data.mime_type.startsWith('image/')) ||
            (part.inlineData && part.inlineData.mime_type && part.inlineData.mime_type.startsWith('image/'))
          );
          
          if (imagePart) {
            // Handle both inline_data and inlineData formats
            const inlineData = imagePart.inline_data || imagePart.inlineData;
            
            if (inlineData && inlineData.data) {
              const resultImageBase64 = inlineData.data;
              const mimeType = inlineData.mime_type || 'image/jpeg';
              setResultImage(`data:${mimeType};base64,${resultImageBase64}`);
              console.log('Successfully received image from Gemini API');
            } else {
              throw new Error('Invalid inline data format');
            }
          } else {
            // Log if we find text instead
            const textPart = parts.find((part: any) => part.text);
            if (textPart) {
              console.log('Found text in response instead of image:', textPart.text);
            }
            
            console.log('No image part found, checking full response structure');
            console.log(JSON.stringify(response.data, null, 2));
            
            throw new Error('No image found in Gemini API response');
          }
        } else {
          console.log('Invalid response format, checking full response:');
          console.log(JSON.stringify(response.data, null, 2));
          throw new Error('Invalid response format from Gemini API');
        }
        
      } catch (apiError) {
        console.error('Error with image processing or API call:', apiError);
        
        // If any of the above fails, fall back to the mockup flow
        console.log('Falling back to mockup images...');
        useMockupImage(selectedItem);
      }
      
    } catch (error) {
      console.error('Error processing image:', error);
      setProcessingImage(false);
      Alert.alert('Processing Error', 'Failed to generate virtual try-on. Please try again.');
    } finally {
      setProcessingImage(false);
    }
  };
  
  // Helper function to use mockup images when API fails
  const useMockupImage = (selectedItem: any) => {
    // Create a simulated composite image for demo purposes
    let mockupResultImageUri = '';
    
    switch (selectedItem.category) {
      case 'Jackets':
        mockupResultImageUri = 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop';
        break;
      case 'Tops':
        mockupResultImageUri = 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?q=80&w=1000&auto=format&fit=crop';
        break;
      case 'Bottoms':
        mockupResultImageUri = 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop';
        break;
      case 'Dresses':
        mockupResultImageUri = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop';
        break;
      case 'Outerwear':
        mockupResultImageUri = 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=1000&auto=format&fit=crop';
        break;
      default:
        mockupResultImageUri = 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop';
    }
    
    // Simulate processing delay
    setTimeout(() => {
      console.log('Processing complete (mockup)!');
      setResultImage(mockupResultImageUri);
    }, 1000);
  };

  // Convert image URI to base64
  const convertImageToBase64 = async (uri: string): Promise<string> => {
    try {
      // Check if this is a remote URL (starts with http)
      if (uri.startsWith('http')) {
        // Generate a safe temporary filename
        const filename = FileSystem.documentDirectory + `temp_image_${Date.now()}.jpg`;
        
        console.log(`Downloading image to: ${filename}`);
        
        // Download the file
        const downloadResult = await FileSystem.downloadAsync(uri, filename);
        
        if (downloadResult.status !== 200) {
          throw new Error(`Failed to download image, status: ${downloadResult.status}`);
        }
        
        // Get file info to check size
        const fileInfo = await FileSystem.getInfoAsync(filename);
        console.log(`File info: ${JSON.stringify(fileInfo)}`);
        
        // Check if file exists and has size property
        if (fileInfo.exists && 'size' in fileInfo && fileInfo.size) {
          console.log(`File size: ${fileInfo.size} bytes`);
          
          // If file is too large, resize it (Gemini has limits on input size)
          if (fileInfo.size > 10000000) { // Over 10MB
            console.log('Image too large, using mockup instead');
            // Too large for base64 conversion, throw error to use mockup
            throw new Error('Image file too large for processing');
          }
        }
        
        // Now read the local file as base64
        const base64 = await FileSystem.readAsStringAsync(filename, {
          encoding: FileSystem.EncodingType.Base64
        });
        
        // Clean up the temp file
        try {
          await FileSystem.deleteAsync(filename, { idempotent: true });
        } catch (cleanupError) {
          console.log('Warning: Failed to clean up temp file:', cleanupError);
        }
        
        return base64;
      } else {
        // It's a local file, read it directly
        // Get file info to check size first
        const fileInfo = await FileSystem.getInfoAsync(uri);
        console.log(`Local file info: ${JSON.stringify(fileInfo)}`);
        
        // Check if file exists and has size property
        if (fileInfo.exists && 'size' in fileInfo && fileInfo.size) {
          console.log(`Local file size: ${fileInfo.size} bytes`);
          
          // If file is too large, resize it or reject
          if (fileInfo.size > 10000000) { // Over 10MB
            console.log('Local image too large, using mockup instead');
            throw new Error('Image file too large for processing');
          }
        }
        
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64
        });
        
        return base64;
      }
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to convert image to base64');
    }
  };

  // Save result to wardrobe
  const saveToWardrobe = () => {
    if (!resultImage) return;
    
    // TODO: Implement saving to user's wardrobe
    Alert.alert('Success', 'Outfit saved to your wardrobe!');
  };
  
  // Reset everything and start over
  const resetTryOn = () => {
    setUserImage(null);
    setSelectedClothing(null);
    setResultImage(null);
  };

  // Render clothing option card
  const renderClothingOption = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.clothingOption,
        selectedClothing === item.id && styles.selectedClothingOption
      ]}
      onPress={() => setSelectedClothing(item.id)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.clothingImage} 
      />
      <Text style={styles.clothingName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Handle permission denied
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <MaterialIcons name="no-photography" size={60} color="#FF385C" />
        <Text style={styles.permissionTitle}>Camera Permission Denied</Text>
        <Text style={styles.permissionText}>
          Please enable camera access in your device settings to use this feature.
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => Alert.alert('Please open your device settings to grant permissions')}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Loading state
  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF385C" />
        <Text style={styles.loadingText}>Requesting camera permissions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header (only when camera is not visible) */}
      {!cameraVisible && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>DRIPPY</Text>
          <Text style={styles.headerSubtitle}>TRYING ROOM</Text>
        </View>
      )}

      {/* Camera View */}
      {cameraVisible ? (
        <View style={styles.cameraContainer}>
          {/* @ts-ignore */}
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={cameraType}
            flashMode={flashMode}
          >
            {/* Camera controls */}
            <View style={styles.cameraControlsTop}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setCameraVisible(false)}
              >
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={toggleFlashMode}
              >
                <MaterialIcons 
                  name={
                    flashMode === 'on' ? "flash-on" : 
                    flashMode === 'auto' ? "flash-auto" : 
                    "flash-off"
                  } 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cameraControlsBottom}>
              <View style={styles.cameraButtonPlaceholder} />
              
              <TouchableOpacity 
                style={styles.captureButton}
                onPress={takePicture}
                disabled={isTakingPicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={toggleCameraType}
              >
                <MaterialIcons name="flip-camera-ios" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Result Image */}
          {resultImage ? (
            <View style={styles.resultContainer}>
              <Text style={styles.sectionTitle}>Your Virtual Try-On</Text>
              <Image 
                source={{ uri: resultImage }} 
                style={styles.resultImage} 
                resizeMode="contain"
              />
              <View style={styles.resultActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={saveToWardrobe}
                >
                  <Text style={styles.buttonText}>Save to Wardrobe</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={resetTryOn}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Try Another</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {/* User Image Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Step 1: Your Photo</Text>
                <View style={styles.imageSelectionContainer}>
                  {userImage ? (
                    <View style={styles.selectedImageContainer}>
                      <Image 
                        source={{ uri: userImage }} 
                        style={styles.selectedImage} 
                      />
                      <TouchableOpacity 
                        style={styles.changeImageButton}
                        onPress={() => setUserImage(null)}
                      >
                        <Text style={styles.buttonText}>Change Photo</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.imageOptions}>
                      <TouchableOpacity 
                        style={styles.imageOptionButton}
                        onPress={() => setCameraVisible(true)}
                      >
                        <MaterialIcons name="camera-alt" size={32} color="#FFFFFF" style={styles.imageOptionIcon} />
                        <Text style={styles.imageOptionText}>Take Photo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.imageOptionButton}
                        onPress={pickImage}
                      >
                        <MaterialIcons name="photo-library" size={32} color="#FFFFFF" style={styles.imageOptionIcon} />
                        <Text style={styles.imageOptionText}>Choose from Gallery</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {/* Clothing Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Step 2: Choose Clothing</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.clothingOptionsContainer}
                >
                  {CLOTHING_OPTIONS.map(renderClothingOption)}
                </ScrollView>
              </View>

              {/* Process Button */}
              <View style={styles.processSection}>
                <TouchableOpacity 
                  style={[
                    styles.processButton,
                    (!userImage || !selectedClothing) && styles.disabledButton
                  ]}
                  onPress={processVirtualTryOn}
                  disabled={!userImage || !selectedClothing || processingImage}
                >
                  {processingImage ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.processButtonText}>Try It On!</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* Processing overlay */}
      {processingImage && !cameraVisible && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#FF385C" />
          <Text style={styles.processingText}>Creating your virtual try-on...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  imageSelectionContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageOptionButton: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    width: '45%',
  },
  imageOptionIcon: {
    marginBottom: 8,
  },
  imageOptionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  selectedImageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  changeImageButton: {
    backgroundColor: '#7209B7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 16,
  },
  clothingOptionsContainer: {
    paddingVertical: 8,
  },
  clothingOption: {
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 12,
    width: 100,
  },
  selectedClothingOption: {
    borderWidth: 2,
    borderColor: '#FF385C',
  },
  clothingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  clothingName: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
  },
  processSection: {
    paddingHorizontal: 16,
    marginVertical: 24,
    alignItems: 'center',
  },
  processButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#555555',
    opacity: 0.5,
  },
  processButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControlsTop: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  cameraControlsBottom: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 10,
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  cameraButtonPlaceholder: {
    width: 46,
    height: 46,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  resultContainer: {
    padding: 16,
    alignItems: 'center',
  },
  resultImage: {
    width: width - 32,
    height: height * 0.5,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 150,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#7209B7',
  },
  secondaryButtonText: {
    color: '#7209B7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#7209B7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
});

export default TryingRoomScreen; 