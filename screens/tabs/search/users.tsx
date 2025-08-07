import React from "react";
import { FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useUser } from "@/hooks/use-user";
import UserRow from "@/components/shared/user-row";
import { Divider } from "@/components/ui/divider";
import { useFollowing } from "@/hooks/use-following";
import { useAuth } from "@/providers/AuthProvider";

export default ({ search }: { search: string }) => {
  const { user } = useAuth();
  const { data } = useUser({ search });
  const { data: followingData, refetch: refetchFollowing } = useFollowing(user?.id);

  return (
    <VStack space="md">
      <Text size="lg" bold className="text-black p-2">
        New Users
      </Text>
      <FlatList
        data={data}
        contentContainerClassName="gap-2"
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <UserRow user={item} followingData={followingData} refetchFollowing={refetchFollowing} />
        )}
      />
    </VStack>
  );
};
