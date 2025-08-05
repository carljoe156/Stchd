import React from "react";
import { FlatList, Text } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { usePosts } from "@/hooks/use-posts";
import { Divider } from "@/components/ui/divider";
import PostView from "@/components/shared/post-view";
import { User } from "@/lib/types";

export default ({ user }: { user: User }) => {
  const {
    data = [],
    refetch,
    isLoading,
  } = usePosts({
    filters: [
      { key: "user_id", value: user?.id, type: "eq" },
      { key: "parent_id", value: null, type: "neq" },
      { key: "parent.user_id", value: user?.id, type: "neq" },
    ],
  });

  return (
    <FlatList
      data={data.filter((item) => item?.parent)}
      refreshing={isLoading}
      onRefresh={refetch}
      contentContainerClassName="gap-2 p-2"
      // showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <Divider />}
      ListEmptyComponent={() => <Text className="text-lg self-center">No replies</Text>}
      renderItem={({ item }) => {
        return (
          <VStack space="md">
            <PostView item={item.parent} refetch={refetch} showDivider={true} />
            <PostView item={item} refetch={refetch} />
          </VStack>
        );
      }}
    />
  );
};
