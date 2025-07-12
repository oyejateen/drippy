# Walmart Shopping App with AI Chatbot

A modern React Native shopping application built for Walmart hackathon, featuring an advanced AI chatbot powered by Google Gemini API.

## Features

### 🛍️ Shopping Experience
- **Walmart Product Integration**: Full integration with Walmart product dataset
- **Modern UI**: Clean, modern interface with shopping-focused design
- **Product Discovery**: Browse products by categories, tags, and search
- **Featured Products**: Curated collections of top-rated and discounted items
- **Product Details**: Comprehensive product information with size/color selection

### 🤖 AI Chatbot Assistant
- **Gemini AI Powered**: Advanced conversational AI using Google's Gemini API
- **Product Recommendations**: Smart product suggestions based on user queries
- **Shopping Assistance**: Help with product searches, deals, and category browsing
- **Floating Interface**: Easy-to-access chatbot button on home screen
- **Real-time Responses**: Instant AI-powered responses with product cards

### 🎯 Unique Selling Points
- **Virtual Try-On**: AR-powered trying room for clothing items
- **Personalized Wardrobe**: Save and organize favorite items
- **Smart Recommendations**: AI-driven product suggestions
- **Modern Shopping Experience**: Seamless integration of AI and e-commerce

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

To get a Gemini API key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 3. Run the Application
```bash
npm start
```

Then press:
- `a` for Android
- `i` for iOS
- `w` for web

## Project Structure

```
drippy/
├── components/
│   └── WalmartChatbot.tsx      # AI chatbot component
├── screens/
│   ├── HaulScreen.tsx          # Main shopping screen
│   ├── ProductDetailScreen.tsx  # Product details
│   ├── TryingRoomScreen.tsx    # AR try-on feature
│   └── WardrobeScreen.tsx      # Saved items
├── utils/
│   ├── walmartDataSource.ts    # Walmart data handling
│   └── dataSource.ts          # Legacy data source
├── navigation/
│   └── index.tsx              # App navigation
└── assets/
    └── dataset/
        └── walmart-products.csv # Walmart product dataset
```

## Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **Google Gemini AI**: Advanced AI chatbot
- **TypeScript**: Type-safe development
- **NativeWind**: Tailwind CSS for React Native
- **React Navigation**: Navigation framework

## Features Breakdown

### Walmart Data Integration
- Parses Walmart CSV dataset
- Handles product categories, pricing, and availability
- Supports search and filtering
- Caches data for performance

### AI Chatbot Features
- Natural language processing
- Product recommendations
- Category-specific suggestions
- Deal and discount information
- Real-time conversation flow

### Shopping Experience
- Featured products showcase
- Discounted items highlighting
- Category-based browsing
- Advanced search functionality
- Product comparison tools

### Modern UI/UX
- Clean, minimalist design
- Walmart brand colors
- Smooth animations
- Responsive layouts
- Accessibility features

## Hackathon Highlights

This app demonstrates:
1. **AI Integration**: Seamless AI chatbot for shopping assistance
2. **Data Processing**: Efficient handling of large Walmart dataset
3. **Modern Architecture**: Clean, maintainable code structure
4. **User Experience**: Intuitive shopping interface
5. **Innovation**: AR try-on as unique selling point

## Future Enhancements

- Payment integration
- User authentication
- Shopping cart functionality
- Order tracking
- Push notifications
- Social sharing features
- Advanced AR features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is created for Walmart hackathon demonstration purposes.
