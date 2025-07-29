import React from "react";
import { Pressable, SafeAreaView, View } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  Images,
  Camera,
  ImagePlay,
  Mic,
  Hash,
  MapPin,
} from "lucide-react-native";
import { Heading } from "@/components/ui/heading";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import * as Crypto from "expo-crypto";
import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Input, InputField } from "@/components/ui/input";
import { Divider } from "@/components/ui/divider";

export default () => {
  const { user } = useAuth();
  const [text, setText] = React.useState("");

  const onPress = async () => {
    const { data, error } = await supabase.from("Post").insert({
      id: Crypto.randomUUID(),
      user_id: user?.id,
      text,
    });

    if (!error) router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white pt-10">
      <HStack className="items-center justify-between p-3">
        <Button
          onPress={() => router.back()}
          variant="link"
          size="md"
          className="w-14"
        >
          <ButtonText className="text-black">Cancel</ButtonText>
        </Button>
        <Text className="text-lg font-bold text-black">New Post</Text>
        <View className="w-14" />
      </HStack>
      <Divider />

      <HStack className="items-start px-5">
        <VStack space="md" className="items-center">
          <Avatar size="md">
            <AvatarFallbackText>{user?.username}</AvatarFallbackText>
            <AvatarImage
              source={{ uri: user?.avatar }}
              className="w-8 h-8 rounded-full"
            />
          </Avatar>
          <Divider orientation="vertical" className="h-16" />
        </VStack>

        <Card size="md" className="ml-3 flex-1 bg-transparent">
          <VStack className="p-3" space="lg">
            <VStack>
              <Heading size="md" className="mb-1 text-black">
                {user?.username}
              </Heading>
              <Input size="md" className="border-0">
                <InputField
                  placeholder="What's New?"
                  value={text}
                  onChangeText={setText}
                  className="px-0 text-black"
                />
              </Input>
            </VStack>
            <HStack className="items-center justify-between">
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

      <HStack className="items-center justify-between p-5 mt-4">
        <Text size="sm" className="text-gray-500">
          Anyone can reply & quote
        </Text>
        <Button className="ml-auto rounded-full py-3 px-6" onPress={onPress}>
          <ButtonText className="font-roboto text-white text-lg">
            Post
          </ButtonText>
        </Button>
      </HStack>
    </SafeAreaView>
  );
};
