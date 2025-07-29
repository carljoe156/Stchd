import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarImage, AvatarFallbackText } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/providers/AuthProvider";
import { router, useLocalSearchParams } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { FlatList } from "react-native";
import PostCard from "./card";
import { usePost } from "@/providers/PostProvider";

export default () => {
  const { threadId } = useLocalSearchParams();
  const { user } = useAuth();
  const { posts, updatePost, addThread, uploadPosts, clearPosts } = usePost();
  const [isPosting, setIsPosting] = React.useState(false);

  const handlePost = async () => {
    setIsPosting(true);
    try {
      const result = await uploadPosts();
      if (result) {
        clearPosts();
        router.back();
      } else {
        Alert.alert("Error", "Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Post upload error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleCancel = () => {
    clearPosts();
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={75}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="h-full">
          <HStack className="w-full justify-between items-center p-3">
            <Button variant="link" onPress={handleCancel}>
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
                renderItem={({ item }) => <PostCard post={item} />}
              />

              <HStack className="items-start px-6">
                <Avatar size="xs">
                  <AvatarFallbackText>{user?.username}</AvatarFallbackText>
                  <AvatarImage source={{ uri: user?.avatar }} />
                </Avatar>
                <Button variant="link" onPress={addThread}>
                  <ButtonText className="text-sm font-normal px-3">Add to Thread</ButtonText>
                </Button>
              </HStack>
            </VStack>

            <HStack className="items-center justify-between p-3 mb-18">
              <Text size="sm">Anyone can reply & quote</Text>
              <Button className="rounded-full" onPress={handlePost} disabled={isPosting}>
                <Text>{isPosting ? "Posting..." : "Post"}</Text>
              </Button>
            </HStack>
          </VStack>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
