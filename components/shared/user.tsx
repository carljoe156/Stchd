import React from "react";
import { Pressable, SafeAreaView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { User } from "@/lib/types";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Plus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { usePost } from "@/providers/PostProvider";

enum Tab {
  THREADS = "Threads",
  REPLIES = "Replies",
  REPOSTS = "Reposts",
}

export default ({ user }: { user: User }) => {
  const { logOut } = useAuth();
  const [tab, setTab] = React.useState<Tab>(Tab.THREADS);
  //    const [photo, setPhoto] = React.useState<String>('');
  const avatarUrl = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${user.id}/avatar.jpeg`;
  const { uploadFile } = usePost();

  const addPhoto = async () => {
    // setPhoto('');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      // quality: 0.1,
      // aspect: [16, 9],
      quality: 0.1,
    });
    if (!result.assets?.[0]?.uri) return;

    let uri = result.assets?.[0]?.uri;
    let type = result.assets?.[0]?.mimeType;
    let name = `avatar.jpeg`;
    // setPhoto(uri);
    const path = await uploadFile("", uri, type, name);
    console.log(path);
  };

  return (
    <SafeAreaView className="flex-1 pt-10">
      <HStack className="items-center justify-between p-3">
        <Text size="3xl" bold className="text-black">
          {user?.username}
        </Text>
        <Pressable onPress={addPhoto}>
          <Avatar size="lg">
            <AvatarBadge
              size="lg"
              style={{ backgroundColor: "black", alignItems: "center", justifyContent: "center" }}
            >
              <Plus size={8} color="white" strokeWidth={5} />
            </AvatarBadge>
            <AvatarFallbackText>{user?.username}</AvatarFallbackText>
            <AvatarImage source={{ uri: avatarUrl }} />
          </Avatar>
        </Pressable>
      </HStack>
      <HStack space="md" className="items-center justify-between p-3">
        {/* <Text size="xl" bold className="text-black">
          {user?.bio}
        </Text> */}
        <Button onPress={() => {}} variant="outline" className="flex-1 border-gray-400 rounded-xl">
          <ButtonText>Edit profile</ButtonText>
        </Button>
        <Button onPress={() => {}} variant="outline" className="flex-1 border-gray-400 rounded-xl">
          <ButtonText>Share profile</ButtonText>
        </Button>
      </HStack>

      <HStack className="items-center justify-between p-3">
        {Object.values(Tab).map((t) => (
          <Button
            key={t}
            onPress={() => setTab(t)}
            variant="link"
            className={`flex-1 border-b ${t === tab ? "border-black" : "border-gray-300"}`}
          >
            <ButtonText className={t === tab ? "text-black" : "text-gray-500"}>{t}</ButtonText>
          </Button>
        ))}
      </HStack>
    </SafeAreaView>
  );
};
