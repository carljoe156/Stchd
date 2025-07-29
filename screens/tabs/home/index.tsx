import React from "react";
import { FlatList, Pressable, SafeAreaView, View, Image } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import StchdIcon from "@/assets/icons/stchd";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallbackText, AvatarBadge } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  Images,
  Camera,
  ImagePlay,
  Mic,
  Hash,
  MapPin,
  Plus,
  MessageCircle,
  Heart,
  Repeat,
  Send,
} from "lucide-react-native";
import { router } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { usePosts } from "@/hooks/use-posts";
import { formatDistanceToNow } from "date-fns";

export default () => {
  const { user } = useAuth();
  const { data, refetch, isLoading } = usePosts();

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
                uri: user?.avatarUrl,
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
          renderItem={({ item }) => {
            return (
              <Card>
                <HStack space="md">
                  <Avatar size="md">
                    <AvatarBadge>
                      <Plus size={12} color="white" />
                    </AvatarBadge>
                    <AvatarFallbackText>{item.User.username}</AvatarFallbackText>
                    <AvatarImage
                      source={{
                        uri: item.User.avatar,
                      }}
                      className="w-12 h-12 rounded-full"
                    />
                  </Avatar>
                  <VStack className="flex-1" space="md">
                    <HStack className="items-center" space="md">
                      <Text size="lg" bold>
                        {item.User.username}
                      </Text>
                      <Text size="md" className="text-gray-500 mx-5 ">
                        .
                      </Text>

                      <Text size="md" className="text-gray-500 text-xs  ">
                        {item?.created_at &&
                          formatDistanceToNow(
                            new Date(item.created_at) - new Date().getTimezoneOffset() * 6000,
                            { addSuffix: true }
                          )}
                      </Text>
                    </HStack>
                    <Text size="lg">{item?.text}</Text>
                    {item?.file && (
                      <Image
                        source={{
                          uri: `${process.env.EXPO_PUBLIC_BUCKET_URL}/${item.user_id}/${item.file}`,
                        }}
                        style={{ width: "100%", height: 200, borderRadius: 10 }}
                      />
                    )}
                    <HStack className="items-center" space="lg">
                      <Heart size={20} color="gray" strokeWidth={1.5} />
                      <MessageCircle size={20} color="gray" strokeWidth={1.5} />
                      <Repeat size={20} color="gray" strokeWidth={1.5} />
                      <Send size={20} color="gray" strokeWidth={1.5} />
                    </HStack>
                  </VStack>
                </HStack>
                <Divider className="w-full" style={{ marginTop: 20 }} />
              </Card>
            );
          }}
        />
      </VStack>
    </SafeAreaView>
  );
};
