import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface PostProps {
  key: string;
  value: string | null;
  type: "eq" | "is";
}

export const getPosts = async ({ key, value, type }: PostProps) => {
  const { data, error } = await supabase
    .from("Post")
    .select(
      `
    *,
    user:User!user_id(*),
    Place(name),
    Like(user_id),
    repost_user:User!repost_user_id(*),
    Post(*, user:User!user_id(*))
    `
    )
    .filter(key, type, value)
    .order("created_at", { ascending: false });
  if (!error) return data;
};

export const usePosts = ({ key, value, type }: PostProps) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["posts", key, type, value],
    queryFn: () => getPosts({ key, value, type }),
  });

  return { data, isLoading, error, refetch };
};
