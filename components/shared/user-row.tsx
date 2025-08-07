import React from "react";
import { SafeAreaView, FlatList, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useFollowers } from "@/hooks/use-followers";
import { useAuth } from "@/providers/AuthProvider";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { VStack } from "@/components/ui/vstack";
import { formatDistanceToNow } from "date-fns";
import { Button, ButtonText } from "@/components/ui/button";
import { useFollowing } from "@/hooks/use-following";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { router } from "expo-router";

// export default ({ item, user, followingData, refetchFollowing }: { user: User, followingData: string[], refetchFollowing: () => void}) => {
export default ({
  user,
  followingData,
  refetchFollowing,
}: {
  user: User;
  followingData: string[];
  refetchFollowing: () => void;
}) => {
  const followUser = async (following_user_id: string) => {
    const { error } = await supabase.from("Followers").insert({
      user_id: user?.id,
      following_user_id,
    });
    if (!error) refetchFollowing();
  };

  const unfollowUser = async (following_user_id: string) => {
    const { error } = await supabase
      .from("Followers")
      .delete()
      .eq("user_id", user?.id)
      .eq("following_user_id", following_user_id);
    if (!error) refetchFollowing();
  };

  const avatarUrl = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${user?.id}/avatar.jpeg`;
  return (
    <HStack space="md" className="items-center">
      <HStack space="md">
        <Avatar size="md" className="mt-6">
          <AvatarFallbackText>{user?.username}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: avatarUrl,
            }}
            className="w-12 h-12 rounded-full"
          />
        </Avatar>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/user",
              params: { userId: user?.id },
            })
          }
        >
          <HStack space="sm" className="items-center">
            <Text size="lg" bold>
              {user?.username}
            </Text>
            <Text size="xs" className="truncate">
              {user?.created_at &&
                formatDistanceToNow(
                  new Date(
                    new Date(user?.created_at).getTime() - new Date().getTimezoneOffset() * 60000
                  ),
                  { addSuffix: true }
                )}
            </Text>
          </HStack>
        </Pressable>
        {/* <Button onPress={() => {setSelectedTab(item)}} size='md' variant={selectedTab === item ? 'solid' : 'outline'} action='primary' className='rounded-lg'> */}
        {followingData?.includes(user?.id) ? (
          <Button
            onPress={() => unfollowUser(user.id)}
            size="md"
            variant="outline"
            action="primary"
            className="rounded-lg"
          >
            <ButtonText>UnFollow</ButtonText>
          </Button>
        ) : (
          <Button
            onPress={() => followUser(user.id)}
            size="md"
            variant="solid"
            action="primary"
            className="rounded-lg"
          >
            <ButtonText>Follow back</ButtonText>
          </Button>
        )}
      </HStack>
    </HStack>
  );
};
