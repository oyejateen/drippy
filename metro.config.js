// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for NativeWind
config.resolver.assetExts.push('css');
config.resolver.sourceExts.push('cjs');
config.resolver.assetExts.push('csv');

// This is the new line you should add in, after the previous lines
config.resolver.unstable_enablePackageExports = false;

module.exports = config; 