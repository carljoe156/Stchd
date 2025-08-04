import { KeyboardAvoidingView, Platform, ScrollView, Alert, Pressable } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import React from "react";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import Layout from "./_layout";

export default () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      Alert.alert("Sign Up Error", error.message);
    } else {
      Alert.alert("Success!", "Account created successfully. Check your email for verification.", [
        { text: "OK", onPress: () => router.push("./auth/login") },
      ]);
    }
  };

  return (
    <Layout onPress={handleSignUp} buttonText={loading ? "Creating Account..." : "Create Account"}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <VStack className="items-center space-y-6">
            <Text className="text-2xl font-bold text-black text-center">Create Account</Text>
            <Text className="text-gray-600 text-center">Join us today</Text>

            <VStack className="space-y-4">
              <Input
                variant="outline"
                size="md"
                className="w-72 border border-gray-400 rounded bg-white"
              >
                <InputField
                  placeholder="Enter your email..."
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </Input>

              <Input
                variant="outline"
                size="md"
                className="w-72 border border-gray-400 rounded bg-white"
              >
                <InputField
                  placeholder="Enter your password..."
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                />
              </Input>

              <Input
                variant="outline"
                size="md"
                className="w-72 border border-gray-400 rounded bg-white"
              >
                <InputField
                  placeholder="Confirm your password..."
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                />
              </Input>
            </VStack>

            <VStack className="items-center space-y-3 mt-6">
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Text className="text-gray-600">
                  Already have an account?
                  <Text className="text-black font-semibold">Sign In</Text>
                </Text>
              </Pressable>

              <Pressable onPress={() => router.push("/(auth)/phone")}>
                <Text className="text-gray-600 underline">Use phone number instead</Text>
              </Pressable>
            </VStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};
