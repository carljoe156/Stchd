import React from "react";
import { SafeAreaView, FlatList } from "react-native";
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

export default () => {
  const { user } = useAuth();
  const { data } = useFollowers(user?.id);
  const { data: followingData, refetch: refetchFollowing } = useFollowing(user?.id);

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

  return (
    <SafeAreaView>
      <FlatList
        horizontal
        data={data}
        contentContainerClassName="gap-2 p-2"
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const avatarUrl = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${item?.user?.id}/avatar.jpeg`;
          return (
            <HStack space="md" className="items-center">
              <HStack space="sm">
                <Avatar size="md">
                  <AvatarFallbackText>{item?.user?.username}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: avatarUrl,
                    }}
                    className="w-12 h-12 rounded-full"
                  />
                </Avatar>
                <VStack>
                  <HStack space="sm" className="items-center">
                    <Text size="lg" bold>
                      {item?.user?.username}
                    </Text>
                    <Text size="xs">
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
                  <Text size="sm">Follows you</Text>
                </VStack>
              </HStack>
              {/* <Button onPress={() => {setSelectedTab(item)}} size='md' variant={selectedTab === item ? 'solid' : 'outline'} action='primary' className='rounded-lg'> */}
              {followingData?.includes(item?.user?.id) ? (
                <Button
                  onPress={() => unfollowUser(item.user.id)}
                  size="md"
                  variant="outline"
                  action="primary"
                  className="rounded-lg"
                >
                  <ButtonText>UnFollow</ButtonText>
                </Button>
              ) : (
                <Button
                  onPress={() => followUser(item.user.id)}
                  size="md"
                  variant="solid"
                  action="primary"
                  className="rounded-lg"
                >
                  <ButtonText>Follow back</ButtonText>
                </Button>
              )}
            </HStack>
          );
        }}
      />
    </SafeAreaView>
  );
};
