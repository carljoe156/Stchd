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
import { useFollowing } from "@/hooks/use-following";

interface PostViewProps {
  item: Post | null;
  refetch: () => void;
  showDivider?: boolean;
}

export default ({ item, refetch, showDivider = false }: PostViewProps) => {
  if (!item) return null;

  const { user } = useAuth();
  const imageUrl = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${item?.user_id}/${item?.file}`;
  const avatarUrl = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${item?.user_id}/avatar.jpeg`;
  const fileType = item.file?.split(".").pop();
  const regex = /([#@]\w+)|([^#@]+)/g;
  const textArray = item?.text?.match(regex) || [];
  const isLiked = item?.likes?.some((like: { user_id: string }) => like.user_id === user?.id);
  const { data: following, refetch: refetchFollowing } = useFollowing(user?.id || "");

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

  const followUser = async () => {
    const { error } = await supabase.from("Followers").insert({
      user_id: user?.id,
      following_user_id: item?.user_id,
    });
    if (!error) refetchFollowing();
  };

  const addRepost = async () => {
    const newPost = {
      id: Crypto.randomUUID(),
      user_id: item?.user_id,
      text: item.text,
      file: item.file,
      place_id: item.place_id,
      tag_name: item.tag_name,
      parent_id: item.id,
      repost_user_id: user?.id,
    };

    const { data, error } = await supabase.from("Post").insert(newPost);
    if (!error) refetch();
  };

  return (
    <Card>
      <HStack space="md">
        <VStack className="items-center">
          <Avatar size="md">
            <AvatarFallbackText>{item?.user?.username}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: avatarUrl,
              }}
              className="w-12 h-12 rounded-full"
            />
            {!following?.includes(item?.user_id) && user?.id !== item?.user_id && (
              <AvatarBadge
                size="xl"
                style={{
                  backgroundColor: "black",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                }}
              >
                <Pressable onPress={followUser}>
                  <Plus size={10} color="white" strokeWidth={5} />
                </Pressable>
              </AvatarBadge>
            )}
          </Avatar>
          {showDivider && (
            <Divider
              orientation="vertical"
              className="absolute"
              style={{ height: "150%", zIndex: -1 }}
            />
          )}
          {/* {item?.parent_id && (
            <Divider
              orientation="vertical"
              className="absolute"
              style={{ height: 85, bottom: -50 }}
            />
          )} */}
        </VStack>
        <VStack className="flex-1 full" space="md">
          <VStack space="xs">
            {item?.repost_user && (
              <HStack className="items-center" space="sm">
                <Repeat size={14} color="gray" strokeWidth={2} />
                <Text size="sm" className="mx-2" bold>
                  Reposted By
                </Text>
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: `/user`,
                      params: { userId: item?.repost_user_id },
                    })
                  }
                >
                  <Text size="sm" bold>
                    {item?.repost_user?.username}
                  </Text>
                </Pressable>
              </HStack>
            )}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: `/user`,
                  params: { userId: item?.user_id },
                })
              }
            >
              <HStack className="items-center" space="md">
                <Text size="lg" bold>
                  {item?.user?.username}
                </Text>
                {/* <Text size="md" className="text-gray-500">
                  .
                </Text> */}
                <Text size="md" className="text-gray-500 text-xs">
                  {item?.created_at &&
                    formatDistanceToNow(
                      new Date(
                        new Date(item?.created_at).getTime() -
                          new Date().getTimezoneOffset() * 60000
                      ),
                      { addSuffix: true }
                    )}
                </Text>
              </HStack>
            </Pressable>

            {item?.place?.name && (
              <Pressable
                onPress={() =>
                  router.push({ pathname: "/posts", params: { placeId: item.place_id } })
                }
              >
                <Text size="xs" bold className="text-gray-500">
                  📍{item?.place?.name}
                </Text>
              </Pressable>
            )}

            {renderText({ textArray, post: item })}

            {item?.file ? (
              fileType === "m4a" ? (
                <Audio id={item.id} uri={imageUrl} />
              ) : (
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: 300, height: 300, borderRadius: 10 }}
                  // className="w-2/3 aspect-[3/4] rounded"
                  // resizeMode="cover"
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

          <HStack className="items-center" space="2xl">
            <Pressable onPress={isLiked ? removeLike : addLike} className="flex-row items-center">
              <Heart
                size={22}
                color={isLiked ? "#ff3040" : "#666"}
                strokeWidth={1.5}
                fill={isLiked ? "#ff3040" : "transparent"}
              />
              {item?.likes?.length > 0 && (
                <Text size="sm" className="ml-1 text-gray-600">
                  {item?.likes?.length}
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
              <HStack className="items-center">
                <MessageCircle size={22} color="#666" strokeWidth={1.5} />
                {item?.posts?.length > 0 && (
                  <Text size="sm" className="ml-1 text-gray-600">
                    {item?.posts?.length}
                  </Text>
                )}
              </HStack>
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
