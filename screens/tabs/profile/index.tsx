import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import Profile from "@/components/shared/profile-view";

export default () => {
  const { user } = useAuth();
  return <Profile user={user} />;
};
