import React from "react";
import { SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { Search } from "lucide-react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { useLocations } from "@/hooks/use-locations";
import * as Location from "expo-location";
import { Place } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { usePost } from "@/providers/PostProvider";

export default () => {
  const { threadId } = useLocalSearchParams();
  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [location, setLocation] = React.useState({
    latitude: 0,
    longitude: 0,
  });
  const { data, isLoading, error } = useLocations(debouncedSearch, location);
  const { updatePost } = usePost();

  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  const addPlace = async (place: Place) => {
    const { data, error } = await supabase
      .from("Place")
      .upsert({
        id: place.place_id,
        name: place.name,
        latitude: place?.geometry?.location?.lat,
        longitude: place?.geometry?.location?.lng,
        address: place?.vicinity || place?.formatted_address,
      })
      .select();
    console.log(data, error);
    if (!error) {
      updatePost(threadId, "place_id", data?.[0]?.id);
      router.back();
    }
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    // setLocation(location);
    // console.log(location.coords);
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
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
          numColumns={1}
          data={data}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={{ paddingVertical: 10 }}
                key={index}
                onPress={() => addPlace(item)}
              >
                <Text size="lg" bold>
                  {item?.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </VStack>
    </SafeAreaView>
  );
};
