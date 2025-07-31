import React from "react";
import { SafeAreaView, FlatList, Text, Pressable, View } from "react-native";
import { Avatar, AvatarImage, AvatarFallbackText, AvatarBadge } from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { useLocalSearchParams, router } from "expo-router";
import { useThread } from "@/hooks/use-thread";
import { ChevronLeft } from "lucide-react-native";
import PostView from "./view";

export default () => {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const { data, isLoading, error, refetch } = useThread(id as string);

  if (!data) return null;
  const thread = data[0];
  const replies = data.slice(1);

  return (
    <SafeAreaView className="bg-white flex-1 pt-10">
      <HStack className="w-full justify-between items-center p-3">
        <Button variant="link" onPress={() => router.back()}>
          <ChevronLeft size={20} color="black" />
          <Text className="w-12 text-black">Back</Text>
        </Button>
        <Text className="text-lg font-bold text-black">Post</Text>
        <View className="w-20" />
      </HStack>
      <VStack space="md">
        <PostView item={data[0]} />
        {/* <Divider /> */}
        <Text className="text-lg font-bold text-black px-3">Replies</Text>
        <Divider />
        <FlatList
          data={data?.[0]?.Post}
          ListFooterComponent={() => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/post",
                  params: { threadId: data[0]?.id },
                })
              }
            >
              <HStack className="items-center" space="md" style={{ paddingHorizontal: 22 }}>
                <Avatar size="sm">
                  <AvatarFallbackText>{user?.username}</AvatarFallbackText>
                  {user?.avatar && <AvatarImage source={{ uri: user?.avatar }} />}
                </Avatar>
                <Text className="text-black">Reply...</Text>
              </HStack>
            </Pressable>
          )}
          renderItem={({ item }) => <PostView item={item} />}
        />
      </VStack>
    </SafeAreaView>
  );
};
