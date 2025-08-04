import React from "react";
import { SafeAreaView, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import PostView from "@/components/shared/post-view";
import { Button, ButtonText } from "@/components/ui/button";
import Follows from "./follows";
import Replies from "./replies";
import Reposts from "./reposts";
import Mentions from "./mentions";
import Messages from "./messages";
import { VStack } from "@/components/ui/vstack";

const tabs = ["Follows", "Replies", "Likes", "Mentions", "Reposts", "Messages"];

export default () => {
  const [selectedTab, setSelectedTab] = React.useState("Follows");

  const _renderTab = (item: string) => {
    switch (item) {
      case "Follows":
        return <Follows />;
      case "Replies":
        return <Replies />;
      case "Reposts":
        return <Reposts />;
      case "Mentions":
        return <Mentions />;
      case "Messages":
        return <Messages />;
    }
  };
  return (
    <SafeAreaView className="pt-10">
      <VStack space="md">
        <Text size="3xl" bold className="text-black px-2">
          Activity
        </Text>
        <FlatList
          horizontal
          data={tabs}
          contentContainerClassName="gap-2 p-2"
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <Button
                onPress={() => setSelectedTab(item)}
                size="md"
                variant={selectedTab === item ? "solid" : "outline"}
                action="primary"
                className="rounded-lg"
              >
                <ButtonText>{item}</ButtonText>
              </Button>
            );
          }}
        />
      </VStack>
      {_renderTab(selectedTab)}
    </SafeAreaView>
  );
};
