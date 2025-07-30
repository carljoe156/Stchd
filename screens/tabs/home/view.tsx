import React from "react";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallbackText, AvatarBadge } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Plus, MessageCircle, Heart, Repeat, Send } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";
import { Divider } from "@/components/ui/divider";
import { Post } from "@/lib/types";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Image } from "react-native";

export default ({ item }: { item: Post }) => {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/thread",
          params: { id: item.id },
        })
      }
    >
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
            <VStack>
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
              {item?.Place?.name && (
                <Text size="xs" bold className="text-gray-500">
                  📍{item?.Place?.name}
                </Text>
              )}
            </VStack>
            <Text size="lg">{item?.text}</Text>
            {item?.file && (
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_BUCKET_URL}/${item?.user_id}/${item?.file}`,
                }}
                style={{ width: "100%", height: 200, borderRadius: 10 }}
              />
            )}
            <HStack className="items-center" space="2xl">
              <Heart size={20} color="gray" strokeWidth={1.5} />
              <MessageCircle size={20} color="gray" strokeWidth={1.5} />
              <Repeat size={20} color="gray" strokeWidth={1.5} />
              <Send size={20} color="gray" strokeWidth={1.5} />
            </HStack>
          </VStack>
        </HStack>
        <Divider className="w-full" style={{ marginTop: 20 }} />
      </Card>
    </Pressable>
  );
};
