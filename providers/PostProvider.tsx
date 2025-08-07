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
    tag_name: null,
    mention_user_id: null,
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

  const checkForTags = (text: string) => {
    const regex = /#\w+(?=\s|$)/g;
    const tags = text.match(regex) || [];
    return tags.map((tag) => tag.slice(1));
  };
  const createTag = async (postId: string, text: string) => {
    const { error } = await supabase
      .from("Tag")
      .upsert({
        name: text,
        updated_at: new Date(),
      })
      .select();
    if (!error) {
      await supabase
        .from("Post")
        .update({
          tag_name: text,
        })
        .eq("id", postId);
    }
  };

  const uploadPosts = async () => {
    posts.map((p) => {
      checkForTags(p.text).forEach((tag) => createTag(p.id, `#${tag.toUpperCase()}`));
    });
    const { data, error } = await supabase.from("Post").insert(posts);
    if (!error) {
      clearPosts();
      router.back();
    }
    if (error) console.error(error);
  };

  const updatePost = (
    id: string,
    keyOrUpdates: string | { key: string; value: string | null }[],
    value?: string | null
  ) => {
    setPosts(
      posts.map((p: Post) => {
        if (p.id === id) {
          const updatedPost = { ...p, user_id: user?.id || "" };
          if (Array.isArray(keyOrUpdates)) {
            keyOrUpdates.forEach(({ key, value }) => {
              updatedPost[key] = value;
            });
          } else {
            updatedPost[keyOrUpdates] = value;
          }

          return updatedPost;
        }
        return p;
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
