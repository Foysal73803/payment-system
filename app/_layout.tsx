import React, { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { UserProvider } from "@/context/userManage";

export default function RootLayout() {

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepareResources() {
      try {
        // Prevent the splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();

        // Load fonts and other assets
        await Font.loadAsync({
          'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
          'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
          'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
        });

        // Simulate additional async tasks (optional)
        await new Promise(resolve => setTimeout(resolve, 1000)); 
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true); // Mark app as ready
        SplashScreen.hideAsync(); // Hide splash screen when ready
      }
    }

    prepareResources();
  }, []);

  if (!appIsReady) {
    return null; // Keep the splash screen visible while loading resources
  }

  return (
    <UserProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='(tabs)' />
      </Stack>
    </UserProvider>
  );
}
