/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme
        background: "#121212",        // Dark background
        surface: "#1E1E1E",           // Slightly lighter dark
        card: "#252525",              // Card background
        
        // Accent colors
        primary: "#FF2D55",           // Vibrant pink
        secondary: "#0A84FF",         // Bright blue
        accent: "#5E5CE6",            // Purple accent
        
        // Text colors
        textPrimary: "#FFFFFF",       // White text
        textSecondary: "#ABABAB",     // Gray text
      },
      fontFamily: {
        heading: ['Poppins-Bold'],
        body: ['Inter-Regular'],
        accent: ['BebasNeue-Regular'],
      },
    },
  },
  plugins: [],
}

