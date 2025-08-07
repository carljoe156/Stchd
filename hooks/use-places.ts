import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const getPlaces = async () => {
  const { data, error } = await supabase
    .from("Place")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw error;
  return data;
};

export const searchPlaces = async (search: string) => {
  const { data, error } = await supabase
    .from("Place")
    .select("*")
    .ilike("name", `%${search}&`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const usePlaces = (search: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["places", search],
    queryFn: search ? () => searchPlaces(search) : getPlaces,
  });
  return { data, isLoading, error };
};
