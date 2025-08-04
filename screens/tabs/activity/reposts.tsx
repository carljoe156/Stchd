import React from "react";
import { usePosts } from "@/hooks/use-posts";
import { Divider } from "@/components/ui/divider";
import { FlatList } from "react-native";
import postView from "@/components/shared/post-view";
import { useAuth } from "@/providers/AuthProvider";
import PostView from "@/components/shared/post-view";

export default () => {
  const { user } = useAuth();
  const {
    data = [],
    isLoading,
    refetch,
  } = usePosts({
    filters: [
      { key: "user_id", value: user?.id, type: "eq" },
      { key: "repost_user_id", value: null, type: "neq" },
    ],
  });

  return (
    <FlatList
      data={data}
      refreshing={isLoading}
      onRefresh={refetch}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => {
        return <PostView item={item} refetch={refetch} />;
      }}
    />
  );
};
