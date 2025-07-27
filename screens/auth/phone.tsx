import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";
import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import Layout from "./_layout";

export default () => {
  // const { user } = useAuth();
  const [phone, setPhone] = React.useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `+1${phone}`,
    });
    if (!error) {
      router.push({
        // pathname: "/(auth)/verify",
        pathname: "./verify",
        params: { phone: `+1${phone}` },
      });
    }
  };

  return (
    <Layout onPress={handleSignIn} buttonText="Sign In">
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
          <Text className="text-lg font-bold text-black mb-4">
            Enter your phone number:
          </Text>
          <Input
            variant="outline"
            size="md"
            className="w-72 border border-gray-400 rounded bg-white"
          >
            <InputField
              placeholder="Enter your phone number..."
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              secureTextEntry={true}
            />
          </Input>
        </ScrollView>
      </KeyboardAvoidingView>
    </Layout>
  );
};
