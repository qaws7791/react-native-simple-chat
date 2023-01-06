import React, { useState, useCallback, useEffect } from "react";
import { Image, StatusBar, View } from "react-native";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { ThemeProvider } from "styled-components/native";
import { theme } from "./theme";
import Navigation from "./navigations";
import * as SplashScreen from "expo-splash-screen";
import { images } from "./utils/images";
import { ProgressProvider, UserProvider } from "./contexts";

const cacheImages = (images) => {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
};

const cacheFonts = (fonts) => {
  return fonts.map((font) => Font.loadAsync(font));
};

const App = () => {
  const [isReady, setIsReady] = useState(false);

  const _loadAssets = async () => {
    const imageAssets = cacheImages([
      require("../assets/splash.png"),
      ...Object.values(images),
    ]);
    console.log(...Object.values(images));
    const fontAssets = cacheFonts([]);

    await Promise.all([...imageAssets, ...fontAssets]);
  };

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        SplashScreen.preventAutoHideAsync();
        await _loadAssets();
        console.log(1);

        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsReady(true);
        console.log(isReady);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
    console.log(" prepare restart");
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <ProgressProvider>
          <StatusBar barStyle={"default"} />
          <Navigation onReady={onLayoutRootView} />
        </ProgressProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
