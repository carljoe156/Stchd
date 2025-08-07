import React from "react";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
} from "@/components/ui/actionsheet";
import { AtSign, Send } from "lucide-react-native";
import { useFollowing } from "@/hooks/use-following";
import { useAuth } from "@/providers/AuthProvider";
import { Pressable } from "react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Post } from "@/lib/types";

export default ({
  post,
  updatePost,
}: {
  post: Post;
  updatePost: (id: string, updates: { key: string; value: string }[]) => void;
}) => {
  const { user } = useAuth();
  const { data } = useFollowing(user?.id || "");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Pressable onPress={() => setIsOpen(!isOpen)}>
        <AtSign size={24} color="gray" strokeWidth={1.5} />
      </Pressable>

      <Actionsheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ActionsheetBackdrop onPress={() => setIsOpen(false)} />
        <ActionsheetContent className="border-none bg-white">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          {data?.map((item) => {
            const avatarUrl = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${item?.id}/avatar.jpeg`;
            return (
              <ActionsheetItem
                key={item?.id}
                className="flex-row items-center justify-between"
                onPress={() => {
                  updatePost(post.id, [
                    { key: "text", value: post.text.concat(`@${item?.username} `) },
                    { key: "mention_user_id", value: item?.id },
                  ]);
                  setIsOpen(false);
                }}
              >
                <HStack space="sm" className="items-center">
                  <Avatar size="sm" className="mt-6">
                    <AvatarFallbackText>{item?.username}</AvatarFallbackText>
                    <AvatarImage
                      source={{
                        uri: avatarUrl,
                      }}
                      className="w-12 h-12 rounded-full"
                    />
                  </Avatar>
                  <ActionsheetItemText bold size="lg">
                    {item?.username}
                  </ActionsheetItemText>
                </HStack>
                <Send size={20} color="black" />
              </ActionsheetItem>
            );
          })}
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};
