import { FlatList, Text } from "react-native";
import { Divider } from "@/components/ui/divider";
import { usePosts } from "@/hooks/use-posts";
import { useAuth } from "@/providers/AuthProvider";
import PostView from "@/components/shared/post-view";

export default () => {
  const { user } = useAuth();
  const { data, refetch, isLoading } = usePosts({
    filters: [{ key: "mention_user_id", value: user?.id, type: "eq" }],
  });

  return (
    <FlatList
      data={data}
      refreshing={isLoading}
      onRefresh={refetch}
      contentContainerClassName="gap-2 p-2"
      showsHorizontalScrollIndicator={false}
      ListEmptyComponent={() => <Text className="text-lg self-center"> No Mentions</Text>}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item }) => <PostView item={item} refetch={refetch} />}
    />
  );
};
