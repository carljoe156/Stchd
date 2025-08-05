import React from "react";
import { FlatList, Text } from "react-native";
import { usePosts } from "@/hooks/use-posts";
import { Divider } from "@/components/ui/divider";
import PostView from "@/components/shared/post-view";
import { User } from "@/lib/types";

export default ({ user }: { user: User }) => {
  const {
    data = [],
    isLoading,
    refetch,
  } = usePosts({
    filters: [{ key: "user_id", value: user?.id, type: "eq" }],
  });

  return (
    <FlatList
      data={data}
      refreshing={isLoading}
      onRefresh={refetch}
      ItemSeparatorComponent={() => <Divider />}
      ListEmptyComponent={() => <Text className="text-lg self-center"> No reposts</Text>}
      renderItem={({ item }) => {
        return <PostView item={item} refetch={refetch} />;
      }}
    />
  );
};
