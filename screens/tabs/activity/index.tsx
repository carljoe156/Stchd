import React from "react";
import { SafeAreaView } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default () => {
  return (
    <SafeAreaView className="pt-10">
      <VStack space="md">
        <Text size="3xl" bold className="text-black px-2">
          Activity
        </Text>
      </VStack>
    </SafeAreaView>
  );
};
