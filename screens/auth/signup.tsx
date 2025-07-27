import { SafeAreaView } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default () => {
  return (
    <SafeAreaView className="pt-10">
      <VStack space="xl" className="p-2">
        <HStack className="justify-between">
          <Text className="text-2xl font-bold">Signup</Text>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};
