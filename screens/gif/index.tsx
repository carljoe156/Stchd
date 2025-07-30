import React from "react";
import { SafeAreaView, FlatList, Image, TouchableOpacity } from "react-native";
import { Search } from "lucide-react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useGifs } from "@/hooks/use-gif";
import { useDebounce } from "@/hooks/use-debounce";
import { usePost } from "@/providers/PostProvider";
import { router, useLocalSearchParams } from "expo-router";
import * as Crypto from "expo-crypto";

export default () => {
  const { threadId } = useLocalSearchParams();
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { data, isLoading, error, refetch } = useGifs(debouncedSearch);
  const { uploadFile, setPhoto } = usePost();

  const handleUpload = async (url: string) => {
    const name = `${Crypto.randomUUID()}.gif`;
    uploadFile(threadId as string, url, "image/gif", name);
    setPhoto(url);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 pt-10">
      <VStack space="3xl" className="p-5">
        <Input className="rounded-lg p-2">
          <InputSlot>
            <InputIcon as={Search} />
          </InputSlot>
          <InputField value={search} onChangeText={setSearch} placeholder="Search..." />
        </Input>
        <FlatList
          numColumns={3}
          data={data?.data}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => handleUpload(item.images.original.url)}>
                <Image
                  source={{ uri: item.images.original.url }}
                  className="h-32 w-32 m-1 rounded-lg"
                />
              </TouchableOpacity>
            );
          }}
        />
      </VStack>
    </SafeAreaView>
  );
};
