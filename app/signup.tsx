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

export default function SignUpScreen() {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, isSignUpLoading } = useAuth();

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", t("error.fillAllFields"));
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", t("error.passwordTooShort"));
      return;
    }

    await signUp({ username, email, password });
  };

  const goToSignIn = () => {
    router.push("/signin");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("auth.createAccount")}</Text>
      <Text style={styles.subtitle}>{t("auth.signUpToGetStarted")}</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t("auth.username")}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

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
          style={[styles.button, isSignUpLoading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={isSignUpLoading}
        >
          {isSignUpLoading ? (
            <ActivityIndicator color={styles.buttonText.color} />
          ) : (
            <Text style={styles.buttonText}>
              {t("auth.createAccountButton")}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t("common.alreadyHaveAccount")}{" "}
          </Text>
          <TouchableOpacity onPress={goToSignIn}>
            <Text style={styles.linkText}>{t("auth.signIn")}</Text>
          </TouchableOpacity>
        </View>
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
}));
