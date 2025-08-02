import React from "react";
import { FlatList, Pressable, SafeAreaView, View, Image, ScrollView } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import StchdIcon from "@/assets/icons/stchd";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallbackText } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Images, Camera, ImagePlay, Mic, Hash, MapPin } from "lucide-react-native";
import { router } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { usePosts } from "@/hooks/use-posts";
import PostView from "@/components/shared/post-view";

export default () => {
  const { user } = useAuth();
  const { data, refetch, isLoading } = usePosts({ key: "parent_id", value: null, type: "is" });
  const avatarUrl = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${user?.id}/avatar.jpeg`;

  return (
    <SafeAreaView className="bg-white">
      <View className="pt-10">
        <HStack className="items-center justify-center">
          <StchdIcon size={40} />
        </HStack>
      </View>

      <Pressable
        onPress={() => {
          router.push("/post");
        }}
      >
        <HStack className="items-center px-5">
          <Avatar size="md" className="mt-6">
            <AvatarFallbackText>{user?.username}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: avatarUrl,
              }}
              className="w-12 h-12 rounded-full"
            />
          </Avatar>

          <Card size="md" className="m-3 bg-transparent">
            <VStack className="p-3" space="lg">
              <VStack>
                <Heading size="md" className="mb-1 text-black">
                  {user?.username}
                </Heading>
                <Text size="md" className="text-gray-500">
                  What's New?
                </Text>
              </VStack>

              <HStack className="items-center" space="3xl">
                <Images size={24} color="gray" strokeWidth={1.5} />
                <Camera size={24} color="gray" strokeWidth={1.5} />
                <ImagePlay size={24} color="gray" strokeWidth={1.5} />
                <Mic size={24} color="gray" strokeWidth={1.5} />
                <Hash size={24} color="gray" strokeWidth={1.5} />
                <MapPin size={24} color="gray" strokeWidth={1.5} />
              </HStack>
            </VStack>
          </Card>
        </HStack>
      </Pressable>
      <Divider />
      <VStack space="lg">
        <FlatList
          data={data}
          refreshing={isLoading}
          onRefresh={refetch}
          renderItem={({ item }) => <PostView item={item} refetch={refetch} />}
        />
      </VStack>
    </SafeAreaView>
  );
};
