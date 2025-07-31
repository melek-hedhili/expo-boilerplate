import { AuthProvider } from "@/context/authContext";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, Text } from "react-native";
import { useUnistyles } from "react-native-unistyles";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const queryClient = new QueryClient({});

function RootLayoutContent() {
  const { isUserAuthenticated, isLoading } = useAuth();
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  useEffect(() => {
    // Only hide the splash screen when authentication state is fully resolved
    if (!isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  // Don't render anything while loading to prevent flash
  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator color={theme.colors.tint} />
        <Text
          style={{
            marginTop: 10,
            color: theme.colors.typography,
            fontSize: 16,
          }}
        >
          {t("common.loading")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.typography,
        headerTitleStyle: {
          color: theme.colors.typography,
        },
      }}
    >
      <Stack.Protected guard={isUserAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isUserAuthenticated}>
        <Stack.Screen name="signin" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}
