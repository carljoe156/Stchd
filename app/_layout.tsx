import { useFonts } from "expo-font";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PostProvider } from "@/providers/PostProvider";

const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PostProvider>
            <Stack initialRouteName="(auth)">
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="post" options={{ headerShown: false, presentation: "modal" }} />
              <Stack.Screen name="camera" options={{ headerShown: false, presentation: "modal" }} />
              <Stack.Screen name="gif" options={{ headerShown: false, presentation: "modal" }} />
              <Stack.Screen name="places" options={{ headerShown: false, presentation: "modal" }} />
              {/* <Stack.Screen name="thread" options={{ headerShown: false }} /> */}
              <Stack.Screen name="+not-found" />
            </Stack>
          </PostProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}
