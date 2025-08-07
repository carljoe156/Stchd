import React from "react";
import { SafeAreaView, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import PostView from "@/components/shared/post-view";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import Tags from "./tags";
import Users from "./users";
import Places from "./places";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { SearchIcon } from "lucide-react-native";
import { useDebounce } from "@/hooks/use-debounce";

const tabs = ["Tags", "Users", "Places"];

export default () => {
  const [selectedTab, setSelectedTab] = React.useState("Tags");
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 500);

  const _renderTab = (item: string) => {
    switch (item) {
      case "Tags":
        return <Tags search={debouncedSearch} />;
      case "Users":
        return <Users search={debouncedSearch} />;
      case "Places":
        return <Places search={debouncedSearch} />;
    }
  };
  return (
    <SafeAreaView className="pt-10">
      <VStack space="xl" className="p-2">
        <Text size="3xl" bold className="text-black">
          Search
        </Text>

        <Input variant="rounded" size="lg">
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField
            className="p-0"
            placeholder="Search..."
            onChangeText={setSearch}
            value={search}
          />
        </Input>

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
