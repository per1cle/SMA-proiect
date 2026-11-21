import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { AppNavigation } from './src/ui/navigation/AppNavigation';

function MainContent() {
  const { darkMode } = useApp();
  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <AppNavigation />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}
