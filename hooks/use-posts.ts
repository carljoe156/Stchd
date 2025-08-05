import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Filter {
  key: string;
  value: string | null;
  type: "eq" | "neq" | "is";
}

interface PostProps {
  filters: Filter[];
}

export const getPosts = async ({ filters }: PostProps) => {
  let query = supabase.from("Post").select(
    `
    *,
    user: user_id(*),
    place: Place(name),
    likes: Like(user_id),
    repost_user: repost_user_id(*),
    posts: Post(*, user: user_id(*)),
    parent: parent_id(*, user: user_id(*))
    `
  );

  filters.forEach((filter) => {
    query = query.filter(filter.key, filter.type, filter.value);
  });

  const { data, error } = await query.order("created_at", { ascending: false });

  if (!error) return data;
  throw error;
};

export const usePosts = ({ filters }: PostProps) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["posts", JSON.stringify(filters)],
    queryFn: () => getPosts({ filters }),
  });

  return { data, isLoading, error, refetch };
};
