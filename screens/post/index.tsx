import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarImage, AvatarFallbackText } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/providers/AuthProvider";
import { router, useLocalSearchParams } from "expo-router";
import * as Crypto from "expo-crypto";
import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Divider } from "@/components/ui/divider";
import { FlatList } from "react-native";
import { Post } from "@/lib/types";
import PostCard from "./card";

export default () => {
  const { threadId } = useLocalSearchParams();
  const { user } = useAuth();
  const DefaultPost: Post = {
    id: Crypto.randomUUID(),
    user_id: user.id,
    parent_id: (threadId as string) ?? null,
    text: "",
  };

  const [posts, setPosts] = React.useState<Post[]>([]);

  React.useEffect(() => {
    setPosts([DefaultPost]);
  }, []);

  const onPress = async () => {
    if (!user) return;
    console.log(posts);
    const { data, error } = await supabase.from("Post").insert(posts);
    console.log(data, error);
    if (!error) router.back();
  };

  const updatePost = (id: string, key: string, value: string) => {
    setPosts(posts.map((p: Post) => (p.id === id ? { ...p, [key]: value } : p)));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={75}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="h-full">
          <HStack className="w-full justify-between items-center p-3">
            <Button variant="link" onPress={() => router.back()}>
              <Text>Cancel</Text>
            </Button>
            <Text className="text-lg font-bold text-black">New Post</Text>
            <Text className="text-xl w-16 mx-2" />
          </HStack>

          <Divider />

          <VStack space="lg" className="flex-1 justify-between">
            <VStack space="md">
              <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard post={item} updatePost={updatePost} />}
              />

              <HStack className="items-start px-6">
                <Avatar size="xs">
                  <AvatarFallbackText>{user?.username}</AvatarFallbackText>
                  <AvatarImage source={{ uri: user?.avatar }} />
                </Avatar>
                <Button
                  variant="link"
                  onPress={() =>
                    setPosts([
                      ...posts,
                      {
                        ...DefaultPost,
                        parent_id: posts[0]?.id,
                      },
                    ])
                  }
                >
                  <ButtonText className="text-sm font-normal px-3">Add to Thread</ButtonText>
                </Button>
              </HStack>
            </VStack>

            <HStack className="items-center justify-between p-3 mb-18">
              <Text size="sm">Anyone can reply & quote</Text>
              <Button className="rounded-full" onPress={onPress}>
                <Text>Post</Text>
              </Button>
            </HStack>
          </VStack>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
