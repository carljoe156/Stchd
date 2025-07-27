import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
// import Layout from './_layout';

export default () => {
  const navigateToPhone = () => {
    router.push("/(auth)/phone");
  };

  return (
    // <Layout onPress={navigateToPhone} buttonText='Continue with Phone'>
    <SafeAreaView className="pt-10">
      <Pressable
        className="w-full p-4 bg-blue-500 rounded-lg mb-4"
        onPress={navigateToPhone}
      >
        <Text className="text-white font-medium text-center">
          Continue with Phone
        </Text>
      </Pressable>
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
            <Text className="text-2xl font-bold text-black text-center">
              Welcome to Threads
            </Text>
            <Text className="text-gray-600 text-center">
              Choose how you'd like to continue
            </Text>

            <VStack className="space-y-4 mt-8">
              <Pressable
                onPress={() => router.push("/(auth)/login")}
                className="w-72 p-4 border-2 border-gray-300 rounded-lg items-center"
              >
                <Text className="text-black font-medium">
                  Sign In with Email
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/(auth)/signup")}
                className="w-72 p-4 border-2 border-gray-300 rounded-lg items-center"
              >
                <Text className="text-black font-medium">
                  Create Account with Email
                </Text>
              </Pressable>
            </VStack>
            {/* </Layout> */}
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
