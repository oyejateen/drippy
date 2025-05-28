# Drippy

Drippy is a modern AI-powered virtual try-on app that lets users preview how clothes look on them before buying. Built with React Native, Expo, and TypeScript, Drippy leverages advanced AI and image processing to provide a seamless, photorealistic try-on experience.

## Features

- **Virtual Try-On:** Use your camera or upload a photo to try on clothes virtually.
- **AI-Powered Image Processing:** Integrates with AI APIs to generate realistic try-on images, preserving your identity and garment details.
- **Product Catalog:** Browse a curated list of fashion products, view details, and try them on virtually.
- **Personal Wardrobe:** Save your favorite items and manage your virtual wardrobe.
- **Cross-Platform:** Works on Android, iOS, and web (via Expo).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/oyejateen/drippy.git
   cd drippy
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your API keys and configuration.
   - Example:
     ```
     OPENAI_API_KEY=your_openai_api_key
     FIREBASE_API_KEY=your_firebase_api_key
     # ...other variables as needed
     ```

4. **Start the development server:**
   ```powershell
   npm run start
   ```
   - For Android: `npm run android`
   - For iOS: `npm run ios`
   - For Web: `npm run web`

5. **Open the app:**
   - Use the Expo Go app on your device, or an emulator/simulator.

## Project Structure

- `/screens` — App screens (Welcome, Login, Product Detail, Try-On, Wardrobe, etc.)
- `/components` — Reusable UI components and permission managers.
- `/utils` — Utility functions, data sources, and Firebase integration.
- `/assets` — Images, icons, and datasets.
- `App.tsx` — Main app entry point.
- `navigation/` — Navigation setup using React Navigation.

## Environment Variables

The app uses environment variables for API keys and configuration. See `.env.example` for required variables.

## Tech Stack

- **React Native** (Expo)
- **TypeScript**
- **Tailwind CSS** (via NativeWind)
- **Firebase** (authentication, storage, Firestore)
- **OpenAI / Gemini API** (for AI image generation)
- **React Navigation**
