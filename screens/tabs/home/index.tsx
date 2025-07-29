import React from "react";
import { FlatList, Pressable, SafeAreaView, View } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import StchdIcon from "@/assets/icons/stchd";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallbackText } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Images, Camera, ImagePlay, Mic, Hash, MapPin } from "lucide-react-native";
import { router, usePathname } from "expo-router";
import { Divider } from "@/components/ui/divider";
import { supabase } from "@/lib/supabase";

export default () => {
  const { user } = useAuth();
  const [stich, setStiches] = React.useState([]);
  const pathname = usePathname();

  React.useEffect(() => {
    if (pathname === "/") getStiches();
  }, [pathname]);

  const getStiches = async () => {
    const { data, error } = await supabase
      .from("Post")
      .select("*, User(*)")
      .is("parent_id", null)
      .order("created_at", { ascending: false });
    if (!error) setStiches(data);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="pt-10">
        <HStack className="items-center justify-center">
          <StchdIcon size={40} />
        </HStack>
      </View>

      <Pressable
        onPress={() => {
          router.push("/post");
        }}
      >
        <HStack className="items-center px-5">
          <Avatar size="md" className="mt-6">
            <AvatarFallbackText>{user?.username}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: user?.avatarUrl,
              }}
              className="w-12 h-12 rounded-full"
            />
          </Avatar>

          <Card size="md" className="m-3 bg-transparent">
            <VStack className="p-3" space="lg">
              <VStack>
                <Heading size="md" className="mb-1 text-black">
                  {user?.username}
                </Heading>
                <Text size="md" className="text-gray-500">
                  What's New?
                </Text>
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
          </Card>
        </HStack>
      </Pressable>
      <Divider />
      <VStack space="lg">
        <FlatList
          data={stich}
          renderItem={({ item }) => {
            return (
              <HStack className="items-center p-3">
                <Avatar size="md">
                  <AvatarFallbackText>{item.User.username}</AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: item.User.avatar,
                    }}
                    className="w-12 h-12 rounded-full"
                  />
                </Avatar>
                <VStack className="flex-1">
                  <HStack className="items-center">
                    <Text size="md" bold>
                      {item.User.username}
                    </Text>
                    <Text size="md" className="text-gray-500 mx-5 ">
                      .
                    </Text>

                    <Text size="md" className="text-gray-500 text-xs ">
                      {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                  </HStack>
                  <Text size="md">{item?.text}</Text>
                </VStack>
              </HStack>
            );
          }}
        />
      </VStack>
    </SafeAreaView>
  );
};
