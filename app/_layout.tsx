import { useFonts } from "expo-font";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <AuthProvider>
        <Stack initialRouteName="(auth)">
          {/* <Stack> */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="post"
            options={{ headerShown: false, presentation: "modal" }}
          />
          <Stack.Screen name="+not-found.tsx" />
        </Stack>
      </AuthProvider>
    </GluestackUIProvider>
  );
}
