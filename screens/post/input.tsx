import React from "react";
import { TextInput } from "react-native";
import { Text } from "@/components/ui/text";
import { Post } from "@/lib/types";
import { router } from "expo-router";

interface InputProps {
  post: Post;
  updatePost: (id: string, updates: { key: string; value: string }[]) => void;
  textArray: string[];
  // setContentHeight: (height: number) => void;
}

export const renderText = ({ textArray, post }: { textArray: string[]; post?: Post }) => {
  {
    if (!textArray) return null;
  }
  return (
    <Text className="my-2">
      {textArray?.map((part, index) => {
        if (part?.startsWith("#") || part?.startsWith("@")) {
          const tag = part?.toUpperCase();
          return (
            <Text
              size="md"
              key={index}
              // size='md'
              className="font-bold"
              onPress={() =>
                part?.startsWith("#")
                  ? router.push({ pathname: "/posts", params: { tag } })
                  : router.push({ pathname: "/user", params: { userId: post?.mention_user_id } })
              }
            >
              {tag}
            </Text>
          );
        } else {
          return (
            <Text size="md" key={index}>
              {part}
            </Text>
          );
        }
      })}
    </Text>
  );
};

export default ({ post, updatePost, textArray }: InputProps) => {
  return (
    <TextInput
      className="text-lg"
      placeholder="what's new?"
      multiline={true}
      onChangeText={(text) => updatePost(post.id, "text", text)}
      // onContentSizeChange={(e) => console.log(e.nativeEvent.contentSize.height) }
    >
      {renderText({ textArray })}
    </TextInput>
  );
};
