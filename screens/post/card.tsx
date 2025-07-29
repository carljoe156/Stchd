import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Images, Camera, ImagePlay, Mic, Hash, MapPin } from "lucide-react-native";
import { Input, InputField } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";
import { Post } from "@/lib/types";

export default ({
  post,
  updatePost,
}: {
  post: Post;
  updatePost: (id: string, text: string) => void;
}) => {
  const { user } = useAuth();

  return (
    <HStack className="items-center px-3">
      <VStack space="md" className="items-center">
        <Avatar size="md">
          <AvatarFallbackText>{user?.username}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: user?.avatar,
            }}
          />
        </Avatar>
      </VStack>

      <Divider orientation="vertical" className="h-16 mx-3" />
      <VStack className="p-3" space="lg">
        <VStack>
          <Heading size="md" className="mb-1">
            {user?.username}
          </Heading>

          <Input size="md" className="border-0">
            <InputField
              placeholder="What's new?"
              className="px-0"
              value={post.text}
              onChangeText={(text) => updatePost(post.id, text)}
            />
          </Input>
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
    </HStack>
  );
};
