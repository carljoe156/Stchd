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

interface PostCardProps {
  post: Post;
  updatePost: (id: string, key: string, value: string) => void;
}

export default ({ post, updatePost }: PostCardProps) => {
  const { user } = useAuth();
  const [photo, setPhoto] = React.useState("");

  const uploadFile = async (uri: string, type: string, name: string) => {
    let newFormData = new FormData();
    newFormData.append("file", {
      uri,
      name,
      type,
    });

    const { data, error } = await supabase.storage
      .from(`files/${user?.id}`)
      .upload(name, newFormData);
    if (data) updatePost(post.id, "file", data.path);
  };

  const addPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });
    let uri = result.assets?.[0]?.uri;
    let type = result.assets?.[0]?.mimeType;
    let name = uri?.split("/").pop();

    setPhoto(uri);
    uploadFile(uri, type, name);
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
        </VStack>
        <HStack className="items-center" space="3xl">
          <Pressable onPress={addPhoto}>
            <Images size={24} color="gray" strokeWidth={1.5} />
          </Pressable>
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
