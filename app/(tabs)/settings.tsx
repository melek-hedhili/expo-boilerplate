import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { changeLanguage, LanguageType } from "@/i18n";
import { Image, Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: user?.avatar || "https://reqres.in/img/faces/1-image.jpg",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {user?.first_name} {user?.last_name}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <Pressable style={styles.signOutButton} onPress={signOut}>
        <Text style={styles.signOutText}>{t("common.signOut")}</Text>
      </Pressable>

      <View style={styles.languageSection}>
        <Text style={styles.sectionTitle}>
          {t("settings.languageSettings")}
        </Text>
        <View style={styles.flagsContainer}>
          {flags.map((flag, index) => (
            <Pressable
              key={index}
              onPress={() => {
                changeLanguage(flag.code);
              }}
            >
              <Image
                resizeMode="contain"
                source={flag.icon}
                style={{ width: 50, height: 50 }}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};
const flags: Flag[] = [
  {
    icon: require("@/assets/icons/png/en.png"),
    name: "English",
    code: "en-US",
  },
  {
    icon: require("@/assets/icons/png/fr.png"),
    name: "French",
    code: "fr-FR",
  },
  {
    icon: require("@/assets/icons/png/ar.png"),
    name: "Arabic",
    code: "ar-AR",
  },
];
type Flag = {
  icon: any;
  name: string;
  code: LanguageType;
};
const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.dimmed,
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.typography,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: theme.colors.typography,
  },
  settingsSection: {
    flex: 1,
  },
  settingItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.typography,
  },
  settingText: {
    fontSize: 16,
    color: theme.colors.typography,
  },
  signOutButton: {
    backgroundColor: theme.colors.accents.apple,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  signOutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  languageSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.dimmed,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.typography,
    marginBottom: 15,
  },
  flagsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
}));

export default SettingsScreen;
