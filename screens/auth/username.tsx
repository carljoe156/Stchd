import React from "react";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import Layout from "./_layout";
import { useAuth } from "@/providers/AuthProvider";

export default () => {
  const [username, setUsername] = React.useState("");
  const { createUser } = useAuth();

  return (
    <Layout onPress={() => createUser(username)} buttonText="Create Account">
      <Text className="text-2xl font-bold p-10">Username</Text>
      <Input variant="outline" size="md" className="w-full">
        <InputField
          placeholder="Enter Username..."
          value={username}
          onChangeText={setUsername}
        />
      </Input>
    </Layout>
  );
};
