import React from "react";
import { FlatList, SafeAreaView } from "react-native";
import { usePosts } from "@/hooks/use-posts";
import { useLocalSearchParams } from "expo-router";
import { Divider } from "@/components/ui/divider";
import PostView from "@/components/shared/post-view";

export default () => {
  const { tag, placeId } = useLocalSearchParams();
  const { data, isLoading, refetch } = usePosts({
    filters: [
      { key: tag ? "tag_name" : "place_id", value: tag || (placeId as string), type: "eq" },
    ],
  });
  return (
    <SafeAreaView>
      <FlatList
        data={data}
        refreshing={isLoading}
        onRefresh={refetch}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => <PostView item={item} refetch={refetch} showDivider={false} />}
        //   keyExtractor={(item) => item.id}
        // showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
