import User from "@/components/shared/user";
import { useLocalSearchParams } from "expo-router";
import { useUser } from "@/hooks/use-user";

export default () => {
  const { userId } = useLocalSearchParams();
  const { data: user } = useUser(userId as string);
  return <User user={user} />;
};
