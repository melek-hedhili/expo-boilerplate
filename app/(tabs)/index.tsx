import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import { Button, Image, Text, View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

const HomeScreen = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const toggleTheme = () => {
    const theme = UnistylesRuntime.themeName === "light" ? "dark" : "light";
    UnistylesRuntime.setTheme(theme);
    storage.set(STORAGE_KEYS.THEME, theme);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: user?.avatar || "https://reqres.in/img/faces/1-image.jpg",
          }}
          style={styles.avatar}
        />
        <Text style={styles.welcomeText}>
          {t("home.welcomeMessage").replace(
            "{{name}}",
            user?.first_name || t("home.user")
          )}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>{t("home.description")}</Text>

        <Button title={t("common.toggleTheme")} onPress={toggleTheme} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.typography,
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  description: {
    fontSize: 16,
    color: theme.colors.link,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
  },
}));

export default HomeScreen;
