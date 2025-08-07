import React from "react";
import { FlatList, Pressable, SafeAreaView, Share } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { User } from "@/lib/types";
import { HStack } from "@/components/ui/hstack";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { Plus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { usePost } from "@/providers/PostProvider";
import { usePosts } from "@/hooks/use-posts";
import { VStack } from "@/components/ui/vstack";
import PostView from "@/components/shared/post-view";
import BottomSheet from "@/components/shared/bottom-sheet";
import { useFollowers } from "@/hooks/use-followers";
// import Threads from "@/screens/tabs/profile/threads";
// import Replies from "@/screens/tabs/profile/replies";
// import Reposts from "@/screens/tabs/profile/reposts";

enum Tab {
  THREADS = "Threads",
  REPLIES = "Replies",
  REPOSTS = "Reposts",
}

const Tabs = [
  {
    name: Tab.THREADS,
    key: "user_id",
  },
  {
    name: Tab.REPLIES,
    key: "user_id",
  },
  {
    name: Tab.REPOSTS,
    key: "repost_user_id",
  },
];

export default ({ user }: { user: User }) => {
  //   const { logOut } = useAuth();
  const { user: authUser } = useAuth();
  const isOwner = authUser?.id === user?.id;
  // const Tabs = ["Threads", "Replies", "Reposts"];
  const [tab, setTab] = React.useState<(typeof Tabs)[number]>(Tabs[0]);
  //    const [photo, setPhoto] = React.useState<String>('');
  const avatarUrl = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${user?.id}/avatar.jpeg`;
  const { data, isLoading, refetch } = usePosts({
    filters: [{ key: tab.key, value: user?.id, type: "eq" }],
  });
  const [showActionSheet, setShowActionSheet] = React.useState(false);
  const { data: followers } = useFollowers(user?.id);
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

  //   const addPhoto = async () => {
  //   const result = await pickImage();
  //   if (!result) return;

  //   const { uri, type } = result;

  //   await uploadFile({
  //     userId: authUser?.id || '',
  //     uri,
  //     type,
  //     name: 'avatar.jpeg',
  //   });
  // };

  const shareProfile = async () => {
    await Share.share({
      message: `Check out ${user?.username}'s profile on Post!`,
    });
  };

  return (
    <SafeAreaView className="flex-1 pt-10 bg-white">
      <HStack className="items-center justify-between p-3">
        <VStack>
          <Text size="3xl" bold className="text-black">
            {user?.username}
          </Text>
          {followers && (
            <AvatarGroup>
              {followers.slice(0, 3).map((item, index) => {
                const avatarUrl = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${item?.user?.id}/avatar.jpeg`;
                return (
                  <Avatar key={index} size="sm" className={"border-2 border-outline-0"}>
                    <AvatarFallbackText className="text-white">
                      {item?.user?.username}
                    </AvatarFallbackText>
                    <AvatarImage
                      source={{
                        uri: avatarUrl,
                      }}
                    />
                  </Avatar>
                );
              })}
              {followers.length > 3 && (
                <Avatar size="sm" className={"border-2 border-outline-0"}>
                  <AvatarFallbackText>{"+ " + (followers.length - 3) + ""}</AvatarFallbackText>
                </Avatar>
              )}
            </AvatarGroup>
          )}
        </VStack>
        <Pressable onPress={isOwner ? addPhoto : () => {}}>
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

      {isOwner && (
        <HStack space="md" className="items-center justify-between p-3">
          {/* <Text size="xl" bold className="text-black">
          {user?.bio}
        </Text> */}
          <Button
            onPress={() => setShowActionSheet(true)}
            variant="outline"
            className="flex-1 border-gray-400 rounded-xl"
          >
            <Text bold>Edit profile</Text>
          </Button>
          <Button
            onPress={shareProfile}
            variant="outline"
            className="flex-1 border-gray-400 rounded-xl"
          >
            <Text bold>Share profile</Text>
          </Button>
        </HStack>
      )}

      <HStack className="items-center justify-between p-3">
        {Tabs.map((t) => (
          <Button
            key={t.name}
            onPress={() => setTab(t)}
            variant="link"
            className={`flex-1 border-b ${
              t.name === tab.name ? "border-black" : "border-gray-400"
            }`}
          >
            <ButtonText className={`${t.name === tab.name ? "text-black" : "text-gray-500"}`}>
              {t.name}
            </ButtonText>
          </Button>
        ))}
      </HStack>
      <VStack space="lg">
        <FlatList
          data={data}
          refreshing={isLoading}
          onRefresh={refetch}
          renderItem={({ item }) => <PostView item={item} refetch={refetch} />}
          // keyExtractor={(item) => item.id}
        />
      </VStack>
      <BottomSheet showActionSheet={showActionSheet} setShowActionSheet={setShowActionSheet} />
    </SafeAreaView>
  );
};
