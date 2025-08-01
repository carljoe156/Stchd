import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import User from "@/components/shared/user";

export default () => {
  const { user } = useAuth();
  return <User user={user} />;
};
