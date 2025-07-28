import React from "react";
import { SafeAreaView } from "react-native";
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
  Heading,
} from "lucide-react-native";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import * as Crypto from "expo-crypto";
import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default () => {
  const { user } = useAuth();

  const onPress = async () => {
    console.log("pressed");
    const { data, error } = await supabase.from("Post ").insert({
      id: Crypto.randomUUID(),
      user_id: user?.id,
      text: "hello world",
    });
    console.log(data, error);
    if (!error) router.back();
  };

  return (
    <SafeAreaView className="flex-1  pt-10">
      <HStack className="items-center justify-between p-5">
        <Avatar size="sm">
          <AvatarFallbackText>{user?.username}</AvatarFallbackText>
          <AvatarImage
            source={{ uri: user?.avatarUrl }}
            className="w-8 h-8 rounded-full"
          />
        </Avatar>
        <Card size="md" className="mx-3 bg-transparent">
          <VStack className="p-3" space="lg">
            <VStack>
              <Heading size="md" className="mb-1 text-black">
                {user?.username || "No username"}
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
    </SafeAreaView>
  );
};
