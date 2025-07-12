require('dotenv').config();
const { GoogleGenAI, Modality } = require('@google/genai');
const fs = require('fs').promises;
const path = require('path');

// Make sure you have a .env file in the project root with GOOGLE_CLOUD_API_KEY=<YOUR_API_KEY>
const API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

if (!API_KEY) {
  console.error('Error: GOOGLE_CLOUD_API_KEY not found in environment variables.');
  console.error('Please create a .env file in the project root with your API key.');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});
// Use the appropriate model for multimodal input/output

// Replace with actual paths to your test images
// Create an 'assets' folder in your project root and place test images there
const personImagePath = path.join(__dirname, 'assets', 'person.jpeg');
const clothingImagePath = path.join(__dirname, 'assets', 'clothing.jpeg');

// Output path for the generated image
const outputImagePath = path.join(__dirname, 'output', 'try_on_result.png');

// The text prompt for the model
const textPrompt = "Create a photorealistic virtual try-on image. Seamlessly integrate the clothing item from the second image onto the person in the first image, preserving their identity and the clothing's appearance. Place the result in a new, distinct background.";

// --- Helper function to prepare image files for the API ---
async function fileToGenerativePart(filePath) {
  try {
    const fileData = await fs.readFile(filePath);
    const mimeType = getMimeType(filePath);
    if (!mimeType) {
      throw new Error(`Could not determine MIME type for file: ${filePath}`);
    }
    return {
      inlineData: {
        data: fileData.toString('base64'),
        mimeType
      },
    };
  } catch (error) {
    console.error(`Error reading or processing file ${filePath}:`, error);
    throw error; // Re-throw to indicate failure
  }
}

// Simple helper to get MIME type based on file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return null;
  }
}

// --- Main function to run the test ---
async function runTest() {
  try {
    console.log('Starting Gemini Vision test script...');

    // Create output directory if it doesn't exist
    await fs.mkdir(path.dirname(outputImagePath), { recursive: true });

    // Prepare image parts
    console.log(`Reading person image from: ${personImagePath}`);
    const personImagePart = await fileToGenerativePart(personImagePath);
    console.log(`Reading clothing image from: ${clothingImagePath}`);
    const clothingImagePart = await fileToGenerativePart(clothingImagePath);

    // Construct the content for the request
    const requestContents = [
      { text: textPrompt },
      personImagePart,
      clothingImagePart
    ];

    console.log('Sending request to Gemini API...');
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{
        role: 'user',
        parts: [
          {
            text: textPrompt
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: personImagePart.inlineData.data
            }
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: clothingImagePart.inlineData.data
            }
          }
        ]
      }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    console.log('Received response from Gemini API.');

    // Check if the response contains an image part and save it
    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
      const imagePart = response.candidates[0].content.parts.find(part => 
        part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')
      );

      if (imagePart) {
        const base64Data = imagePart.inlineData.data;
        // Determine the file extension from the MIME type if possible, default to png
        const mimeType = imagePart.inlineData.mimeType;
        let fileExtension = '.png'; // Default
        if (mimeType === 'image/jpeg') fileExtension = '.jpg';
        else if (mimeType === 'image/png') fileExtension = '.png';
        else if (mimeType === 'image/gif') fileExtension = '.gif';
        else if (mimeType === 'image/webp') fileExtension = '.webp';

        const finalOutputImagePath = path.join(path.dirname(outputImagePath), `try_on_result${fileExtension}`);
        const imageBuffer = Buffer.from(base64Data, 'base64');
        await fs.writeFile(finalOutputImagePath, imageBuffer);
        console.log(`Successfully generated and saved image to: ${finalOutputImagePath}`);
      } else {
        console.log('No image part found in the API response.');
        console.log('Full response:', JSON.stringify(response, null, 2));
      }
    } else {
      console.log('Invalid response format from API.');
      console.log('Full response:', JSON.stringify(response, null, 2));
    }

  } catch (error) {
    console.error('An error occurred during the test:', error);
  }
}

runTest(); 