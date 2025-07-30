import { useQuery } from "@tanstack/react-query";

const getSearch = async (
  search: string,
  location: { latitude: number; longitude: number } | null
) => {
  // const response = await fetch (`https://places.googleapis.com/v1/places/GyuEmsRBfy61i59si0?fields=addressComponents&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`)
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?radius=1i0&query=${search}&location=${location?.latitude}%2C${location?.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );
  const { results } = await response.json();
  return results;
};

const getNearby = async (location: { latitude: number; longitude: number } | null) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=restaurant&radius=1i0&location=${location?.latitude}%2C${location?.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
  );
  const { results } = await response.json();
  return results;
};

export const useLocations = (
  search: string | null,
  location: { latitude: number; longitude: number } | null
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["locations", search],
    queryFn: () => (search ? getSearch(search, location) : getNearby(location)),
  });

  return { data, isLoading, error };
};
