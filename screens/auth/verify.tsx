import React from "react";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import Layout from "./_layout";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default () => {
  const [token, setToken] = React.useState("");
  const { phone } = useLocalSearchParams();

  const handleVerify = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone as string,
      token,
      type: "sms",
    });
    router.push("/(auth)/username");
    console.log(data, error);
  };

  return (
    <Layout onPress={handleVerify} buttonText="Verify">
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
          <Text className="text-2xl font-bold p-10">Verify</Text>
          <Input variant="outline" size="md" className="w-full mb-4">
            <InputField
              placeholder="Enter OTP"
              value={token}
              onChangeText={setToken}
              keyboardType="number-pad"
            />
          </Input>
        </ScrollView>
      </KeyboardAvoidingView>
      <Button onPress={handleVerify} className="w-full bg-black p-5 rounded-lg">
        <ButtonText>Verify</ButtonText>
      </Button>
    </Layout>
  );
};
