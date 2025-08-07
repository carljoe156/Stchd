import React from "react";
import { FlatList, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useTags } from "@/hooks/use-tags";
import { Divider } from "@/components/ui/divider";
import { router } from "expo-router";

export default ({ search }: { search: string }) => {
  const { data } = useTags(search);
  return (
    <VStack space="md" className="p-4">
      <Text size="lg" bold className="text-black p-2">
        Trending Tags
      </Text>
      <FlatList
        data={data}
        contentContainerClassName="gap-4"
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => router.push({ pathname: "/posts", params: { tag: item.name } })}
            >
              <Text size="lg" bold>
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
    </VStack>
  );
};
