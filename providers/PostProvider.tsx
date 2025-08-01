import { supabase } from "@/lib/supabase";
import React from "react";
import { Post } from "@/lib/types";
import * as Crypto from "expo-crypto";
import { useAuth } from "./AuthProvider";
import { router } from "expo-router";

export const PostContext = React.createContext({
  posts: [],
  uploadPosts: () => {},
  addThread: () => {},
  updatePost: (id: string, key: string, value: string) => {},
  clearPosts: () => {},
  uploadFile: (id: string, uri: string, type: string, name: string) => {},
  setPhoto: (uri: string) => {},
  photo: "",
  placeName: "",
  setPlaceName: (name: string) => {},
});

export const usePost = () => React.useContext(PostContext);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const DefaultPost: Post = {
    id: Crypto.randomUUID(),
    user_id: user?.id || "",
    parent_id: null,
    text: "",
    file: null,
    place_id: null,
  };

  const [posts, setPosts] = React.useState<Post[]>([DefaultPost]);
  const [photo, setPhoto] = React.useState<String>("");
  const [placeName, setPlaceName] = React.useState("");

  const uploadFile = async (id: string, uri: string, type: string, name: string) => {
    let newFormData = new FormData();
    newFormData.append("file", {
      uri,
      name,
      type,
    });

    const { data, error } = await supabase.storage
      .from(`files/${user?.id}`)
      .upload(name, newFormData, {
        upsert: true,
      });
    // if (data) updatePost(id, "file", data.path);
    return data?.path;
  };

  const addThread = () => {
    setPosts([...posts, { ...DefaultPost, parent_id: posts[0].id }]);
  };

  // const uploadPosts = async () => {
  //   try {
  //     const { data, error } = await supabase.from("Post").insert(posts);
  //     if (error) {
  //       console.error("Database insert error:", error);
  //       return null;
  //     }
  //     console.log("Posts uploaded successfully:", data);
  //     return data || true;
  //   } catch (error) {
  //     console.error("Upload posts failed:", error);
  //     return null;
  //   }
  // };

  const uploadPosts = async () => {
    const { data, error } = await supabase.from("Post").insert(posts);

    if (error) {
      console.error("Upload error:", error);
      return false;
    }

    return true;
  };

  // const uploadPosts = async () => {
  //   const { data, error } = await supabase.from("Post").insert(posts);
  //   if (!error) {
  //     clearPosts();
  //     router.back();
  //   }
  //   if (!error) console.error(error);
  // };

  const updatePost = (id: string, key: string, value: string) => {
    setPosts(
      posts.map((p: Post) => {
        if (p.id === id) return { ...p, [key]: value, user_id: user?.id };
        return { ...p, user_id: user?.id };
      })
    );
  };

  const clearPosts = () => {
    // setPosts([{ ...DefaultPost, user_id: user?.id || "" }]);
    setPhoto("");
    setPlaceName("");
    setPosts([DefaultPost]);
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        uploadPosts,
        addThread,
        updatePost,
        uploadFile,
        clearPosts,
        setPhoto,
        photo,
        placeName,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
