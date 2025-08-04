import React from "react";
import { FlatList } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { VStack } from "@/components/ui/vstack";
import { usePosts } from "@/hooks/use-posts";
import { Divider } from "@/components/ui/divider";
import PostView from "@/components/shared/post-view";

export default () => {
  const { user } = useAuth();
  const { data, refetch, isLoading } = usePosts({
    filters: [
      { key: "parent_id", value: null, type: "neq" },
      { key: "parent.user_id", value: user?.id, type: "eq" },
      { key: "user_id", value: user?.id, type: "neq" },
    ],
  });

  return (
    <FlatList
      data={data}
      refreshing={isLoading}
      onRefresh={refetch}
      contentContainerClassName="gap-2 p-2"
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => {
        return (
          <VStack space="md">
            <PostView item={item?.parent} refetch={refetch} showDivider={true} />
            <PostView item={item} refetch={refetch} />
          </VStack>
        );
      }}
    />
  );
};
