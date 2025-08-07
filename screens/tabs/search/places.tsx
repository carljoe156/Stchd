import React from "react";
import { FlatList, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { usePlaces } from "@/hooks/use-places";

export default ({ search }: { search: string }) => {
  const { data } = usePlaces(search);
  return (
    <VStack space="md" className="p-4">
      <Text size="lg" bold className="text-black p-2">
        Trending Places
      </Text>
      <FlatList
        data={data}
        contentContainerClassName="gap-4"
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => router.push({ pathname: "/posts", params: { placeId: item.id } })}
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
