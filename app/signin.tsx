import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function SignInScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const { signIn, isLoginLoading } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    await signIn({ email, password });
  };

  const goToSignUp = () => {
    router.push("/signup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("auth.welcomeBack")}</Text>
      <Text style={styles.subtitle}>{t("auth.signInToAccount")}</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t("common.email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder={t("common.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.button, isLoginLoading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={isLoginLoading}
        >
          {isLoginLoading ? (
            <ActivityIndicator color={styles.buttonText.color} />
          ) : (
            <Text style={styles.buttonText}>{t("auth.signIn")}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("auth.dontHaveAccount")} </Text>
          <TouchableOpacity onPress={goToSignUp}>
            <Text style={styles.linkText}>{t("auth.signUp")}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.hint}>{t("auth.testCredentials")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.typography,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.dimmed,
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.dimmed,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: theme.colors.foreground,
    color: theme.colors.typography,
  },
  button: {
    backgroundColor: theme.colors.tint,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.typography,
  },
  linkText: {
    fontSize: 14,
    color: theme.colors.link,
    fontWeight: "600",
  },
  hint: {
    fontSize: 14,
    color: theme.colors.typography,
    textAlign: "center",
    marginTop: 16,
  },
}));
