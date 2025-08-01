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
import Audio from "@/screens/post/audio";
import { renderText } from "@/screens/post/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import * as Crypto from "expo-crypto";

export default ({ item, refetch }: { item: Post; refetch: () => void }) => {
  const { user } = useAuth();
  const imageUrl = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${item?.user_id}/${item?.file}`;
  const fileType = item.file?.split(".").pop();
  const regex = /([#@]\w+)|([^#@]+)/g;
  const textArray = item?.text?.match(regex) || [];
  const isLiked = item?.Like?.some((like: { user_id: string }) => like.user_id === user?.id);

  const addLike = async () => {
    const { error } = await supabase.from("Like").insert({
      user_id: user?.id,
      post_id: item.id,
    });
    if (!error) refetch();
  };

  const removeLike = async () => {
    const { error } = await supabase
      .from("Like")
      .delete()
      .eq("user_id", user?.id)
      .eq("post_id", item.id);
    if (!error) refetch();
  };

  const addRepost = async () => {
    const newPost = {
      id: Crypto.randomUUID(),
      user_id: item?.user_id,
      text: item.text,
      file: item.file,
      place_id: item.place_id,
      tag_name: item.tag_name,
      repost_user_id: user?.id,
    };

    const { data, error } = await supabase.from("Post").insert(newPost);
    if (!error) refetch();
  };

  return (
    <Card>
      <HStack space="md">
        <Avatar size="md">
          <AvatarBadge
            size="lg"
            style={{ backgroundColor: "black", alignItems: "center", justifyContent: "center" }}
          >
            <Plus size={12} color="white" />
          </AvatarBadge>
          <AvatarFallbackText>{item?.user?.username}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: item?.User?.avatar,
            }}
            className="w-12 h-12 rounded-full"
          />
        </Avatar>
        {item?.parent_id && (
          <Divider
            orientation="vertical"
            className="absolute"
            style={{ height: 85, bottom: -50 }}
          />
        )}
        <VStack className="flex-1" space="md">
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/thread",
                params: { id: item.id },
              })
            }
          >
            <VStack>
              {item?.repost_user && (
                <HStack className="items-center" space="md">
                  <Repeat size={14} color="gray" strokeWidth={2} />
                  <Text size="sm" className="mx-2" bold>
                    Reposted By
                  </Text>
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: `/profile`,
                        params: { id: item?.repost_user_id },
                      })
                    }
                  >
                    <Text size="sm" bold>
                      {item?.repost_user?.username}
                    </Text>
                  </Pressable>
                </HStack>
              )}
              <HStack className="items-center" space="md">
                <Text size="lg" bold>
                  {item?.user?.username}
                </Text>
                <Text size="md" className="text-gray-500 mx-5">
                  .
                </Text>
                <Text size="md" className="text-gray-500 text-xs">
                  {item?.created_at &&
                    formatDistanceToNow(
                      new Date(item?.created_at) - new Date().getTimezoneOffset() * 6000,
                      { addSuffix: true }
                    )}
                </Text>
              </HStack>

              {item?.Place?.name && (
                <Text size="xs" bold className="text-gray-500">
                  📍{item?.Place?.name}
                </Text>
              )}

              {renderText(textArray)}

              {item?.file ? (
                fileType === "m4a" ? (
                  <Audio id={item.id} uri={imageUrl} />
                ) : (
                  <Image
                    source={{ uri: imageUrl }}
                    style={{ width: 300, height: 300, borderRadius: 10 }}
                  />
                )
              ) : null}
              {/* {item?.file && (
              <Image
                source={{f
                  uri: imageUrl,
                }}
                style={{ width: "100%", height: 200, borderRadius: 10 }}
              />
            )} */}
            </VStack>
          </Pressable>

          <HStack className="items-center" space="2xl">
            <Pressable onPress={isLiked ? removeLike : addLike} className="flex-row items-center">
              <Heart
                size={22}
                color={isLiked ? "#ff3040" : "#666"}
                strokeWidth={1.5}
                fill={isLiked ? "#ff3040" : "transparent"}
              />
              {item?.Like?.length > 0 && (
                <Text size="sm" className="ml-1 text-gray-600">
                  {item?.Like?.length}
                </Text>
              )}
            </Pressable>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/thread",
                  params: { id: item.id },
                })
              }
              className="flex-row items-center"
            >
              <MessageCircle size={22} color="#666" strokeWidth={1.5} />
              {item?.posts?.length > 0 && (
                <Text size="sm" className="ml-1 text-gray-600">
                  {item?.posts?.length}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={addRepost}>
              <Repeat size={20} color="gray" strokeWidth={1.5} />
            </Pressable>

            <Pressable onPress={() => {}}>
              <Send size={20} color="gray" strokeWidth={1.5} />
            </Pressable>
          </HStack>
        </VStack>
      </HStack>
      <Divider className="w-full" style={{ marginTop: 20 }} />
    </Card>
  );
};
