import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const getUser = async (userId: string) => {
  if (!userId) return null;
  const { data, error } = await supabase.from("User").select().eq("id", userId);

  if (!error) return data[0];
};

export const getUsers = async () => {
  const { data, error } = await supabase
    .from("User")
    .select()
    .order("created_at", { ascending: false })
    .limit(20);
  if (!error) return data;
};

export const searchUsers = async (search: string) => {
  const { data, error } = await supabase
    .from("User")
    .select()
    .ilike("username", `%${search}%`)
    .order("created_at", { ascending: false });
  if (!error) return data;
};

// export const useUser = (userId: string) => {
//     const {data, isLoading, error, refetch} = useQuery ({
//         queryKey: ["user", userId],
//         queryFn: () => getUser(userId),
//     })

//     return {data, isLoading, error, refetch};
// }
/// for both user and users
export const useUser = ({ userId, search }: { userId?: string; search?: string }) => {
  const { data, isLoading, error, refetch } = useQuery({
    // queryKey: ["user", userId, search],
    queryKey: ["user", `${userId}-${search}`],
    queryFn: () => {
      if (userId) return getUser(userId);
      if (search) return searchUsers(search);
      return getUsers();
    },
  });

  return { data, isLoading, error, refetch };
};
