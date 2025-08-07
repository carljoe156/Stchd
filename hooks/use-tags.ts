import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const getTags = async () => {
  const { data, error } = await supabase
    .from("Tag")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error) return data;
};

export const searchTags = async (search: string) => {
  const { data, error } = await supabase
    .from("Tag")
    .select("*")
    .ilike("name", `%${search}&`)
    .order("created_at", { ascending: false });

  if (!error) return data;
};

export const useTags = (search: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tags", search],
    queryFn: () => (search ? searchTags(search) : getTags()),
  });

  return { data, isLoading, error, refetch };
};
