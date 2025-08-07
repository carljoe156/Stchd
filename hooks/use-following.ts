import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
// following_user: User!following_user_id(*)

export const getFollowing = async (userId: string) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("Followers")
    // .select(`following_user_id`)
    .select(`following_user_id(*)`)
    .eq("user_id", userId);

  const following = data?.map((follower) => follower?.following_user_id);

  if (!error) return following;
};

export const useFollowing = (userId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId),
  });

  return { data, isLoading, error, refetch };
};
