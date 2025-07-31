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
import { Pressable, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { usePost } from "@/providers/PostProvider";
import Audio from "./audio";

interface PostCardProps {
  post: Post;
}

export default ({ post }: PostCardProps) => {
  const { threadId } = useLocalSearchParams;
  const { user } = useAuth();
  const { uploadFile, updatePost, photo, setPhoto } = usePost();
  const [showAudio, setShowAudio] = React.useState(false);

  React.useEffect(() => {
    if (!threadId) return;
    updatePost(post.id, "parent_id", threadId as string);
  }, [threadId]);

  const addPhoto = async () => {
    setPhoto("");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });
    if (!result.assets?.[0]?.uri) return;
    let uri = result.assets?.[0]?.uri;
    let type = result.assets?.[0]?.mimeType;
    let name = uri?.split("/").pop();

    setPhoto(uri);
    // uploadFile(id, uri, type, name);
    uploadFile(post.id, uri, type, name);
  };

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

      <Divider orientation="vertical" className="h-16" />
      <VStack className="p-3" space="lg">
        <VStack className="flex-1">
          <Heading size="md" className="mb-1">
            {user?.username}
          </Heading>

          <Input size="md" className="border-0">
            <InputField
              placeholder="What's new?"
              className="px-0"
              value={post.text}
              onChangeText={(text) => updatePost(post.id, "text", text)}
            />
          </Input>
          {photo && (
            <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 10 }} />
          )}
          {showAudio && <Audio id={post.id} userId={""} />}
        </VStack>
        <HStack className="items-center" space="3xl">
          <Pressable onPress={addPhoto}>
            <Images size={24} color="gray" strokeWidth={1.5} />
          </Pressable>
          <Pressable
            onPress={() => {
              setPhoto("");
              router.push({
                pathname: "/camera",
                params: { threadId: post.id },
              });
            }}
          >
            <Camera size={24} color="gray" strokeWidth={1.5} />
          </Pressable>
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/gif",
                params: { threadId: post.id },
              });
            }}
          >
            <ImagePlay size={24} color="gray" strokeWidth={1.5} />
          </Pressable>
          <Pressable onPress={() => setShowAudio(!showAudio)}>
            <Mic size={24} color="gray" strokeWidth={1.5} />
          </Pressable>
          <Hash size={24} color="gray" strokeWidth={1.5} />
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/places",
                params: { threadId: post.id },
              });
            }}
          >
            <MapPin size={24} color="gray" strokeWidth={1.5} />
          </Pressable>
        </HStack>
      </VStack>
    </HStack>
  );
};
