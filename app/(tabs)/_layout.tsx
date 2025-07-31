import { useTranslation } from "@/hooks/use-translation";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useUnistyles } from "react-native-unistyles";

export default function TabLayout() {
  const { theme } = useUnistyles();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.tint,
        tabBarInactiveTintColor: theme.colors.dimmed,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.dimmed,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.typography,
        headerTitleStyle: {
          color: theme.colors.typography,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("common.home"),
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("common.settings"),
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
