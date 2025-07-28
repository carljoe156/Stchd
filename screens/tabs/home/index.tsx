import { SafeAreaView } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import StchdIcon from "@/assets/icons/stchd";

export default () => {
  return (
    <SafeAreaView className="pt-10">
      <HStack className="items-center justify-center pt-10">
        <StchdIcon size={40} />
      </HStack>
      <VStack space="xl" className="p-2">
        <HStack className="justify-between">
          <Text className="text-2xl font-bold">Home</Text>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};
