import { supabase } from "@/lib/supabase";
import username from "@/screens/auth/username";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import React from "react";

export const AuthContext = React.createContext({
  user: {},
  setUser: ({}) => {},
  logOut: () => {},
  createUser: (username: string) => {},
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState({});
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);

  const createUser = async (username: string) => {
    if (!session?.user?.id) {
      console.error("No session found when creating user");
      return;
    }

    const { data, error } = await supabase
      .from("User")
      .insert({
        id: session.user.id,
        username,
      })
      .select();

    if (error) {
      console.error("Error creating user:", error);
      return;
    }

    const user = data[0];
    setUser(user);
    router.push("/(tabs)");
  };

  const getUser = async (session: Session | null) => {
    setLoading(true);

    if (session) {
      setSession(session);

      const { data, error } = await supabase
        .from("User")
        .select()
        .eq("id", session.user.id);

      if (!error && data && data.length > 0) {
        setUser(data[0]);
        router.push("/(tabs)");
      } else {
        console.log("No user profile found, redirecting to username creation");
        setUser({});
        router.push("/(auth)/username");
      }
    } else {
      setUser({});
      setSession(null);
      // router.push('/(auth)');
    }

    setLoading(false);
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    // router.push('/(auth)');
  };

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // console.log("getSession");
      // console.log(session);
      // setSession(session)
      getUser(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      //     console.log("onAuthStateChange");
      // console.log(session);
      // setSession(session);
      getUser(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logOut, createUser }}>
      {children}
    </AuthContext.Provider>
  );
};

function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
