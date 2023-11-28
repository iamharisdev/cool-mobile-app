import React from 'react'
import { RootNavigation } from './src/navigation'
import { AppProvider } from './src/services'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FlashMessage from "react-native-flash-message";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <RootNavigation />
        <FlashMessage position="top" />
      </AppProvider>
    </GestureHandlerRootView>
  )
}

export default App