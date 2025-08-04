import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
// following_user: User!following_user_id(*)

export const getFollowers = async (userId: string) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("Followers")
    .select(
      `
        *, 
        user: User!user_id(*)
         `
    )
    .eq("following_user_id", userId);

  // if (!error) return followers
  if (!error) return data;
};

export const useFollowers = (userId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowers(userId),
  });

  return { data, isLoading, error, refetch };
};
