import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import StchdIcon from "@/assets/icons/stchd";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { router } from "expo-router";

export default ({
  children,
  onPress,
  buttonText,
}: {
  children: React.ReactNode;
  onPress: () => void;
  buttonText: string;
}) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <VStack className="justify-between h-full w-full">
            <VStack className="items-center justify-center">
              {/* <VStack className="mt-8 mb-8"> */}
              <HStack className="justify-between items-center w-full px-6">
                <Button
                  onPress={() => router.back()}
                  size="lg"
                  variant="link"
                  className="flex-row items-start "
                >
                  <ButtonText>Back</ButtonText>
                </Button>
                <StchdIcon size={40} />
                {/* <Button onPress={() => router.back()} size='lg' variant='link' className='flex-row items-end '> */}
                <View className="w-10" />
              </HStack>
            </VStack>
            <VStack className="flex-1 justify-center items-center px-4">
              {children}
            </VStack>
            <VStack className="items-center justify-center">
              <Button onPress={onPress} size="lg">
                <ButtonText>{buttonText}</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
