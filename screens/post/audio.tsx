import React from "react";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { CirclePlay, AudioLines, CirclePause, CircleStop, Circle } from "lucide-react-native";
import { Pressable } from "react-native";
import { useAudioRecorder, AudioModule, RecordingPresets, useAudioPlayer } from "expo-audio";
import { usePost } from "@/providers/PostProvider";
// import { useAuth } from '@/providers/AuthProvider';
import * as Crypto from "expo-crypto";

export default ({ id, userId, uri }: { id: string; userId: string; uri?: string }) => {
  //   const { user } = useAuth();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recording, setRecording] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [audioUri, setAudioUri] = React.useState("");
  const player = useAudioPlayer({ uri: audioUri });
  const { uploadFile } = usePost();
  // console.log(audioRecorder);

  React.useEffect(() => {
    getPermission();
  }, []);

  React.useEffect(() => {
    if (uri) {
      const url = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${userId}/${uri}`;
      setAudioUri(uri);
      console.log("uri", uri);
    }
  }, [uri]);

  const getPermission = async () => {
    const status = await AudioModule.requestRecordingPermissionsAsync();
    if (!status.granted) {
      alert("Permission to access microphone was denied");
    }
  };

  const play = () => {
    setPlaying(true);
    player.play();
  };

  const pause = () => {
    setPlaying(false);
    player.pause();
  };

  const startRecording = () => {
    setRecording(true);
    audioRecorder.record();
  };

  const stopRecording = async () => {
    //   setAudioUri(audioUri);
    setRecording(false);
    await audioRecorder.stop();
    let filename = `${Crypto.randomUUID()}.m4a`;
    const file = await uploadFile(id, audioRecorder.uri || "", "audio/m4a", filename);
    // console.log('File', file);
    let url = `${process.env.EXPO_PUBLIC_BUCKET_URL}/${userId}/${filename}`;
    setAudioUri(url);
  };
  if (audioUri) {
    return (
      <HStack
        style={{ backgroundColor: "lightgray" }}
        className="items-center w-full rounded-full p-2"
        space="3xl"
      >
        <HStack className="items-center">
          <Pressable onPress={playing ? pause : play}>
            {playing ? <CirclePause size={28} color="red" /> : <CirclePlay size={28} color="red" />}
          </Pressable>
          {Array.from({ length: 11 }).map((_, index) => (
            <AudioLines key={index} size={20} color="red" />
          ))}
        </HStack>
      </HStack>
    );
  }

  return (
    <HStack
      style={{ backgroundColor: "lightgray" }}
      className="items-center w-full rounded-full p-2"
      space="3xl"
    >
      <HStack className="items-center">
        <Pressable onPress={recording ? stopRecording : startRecording}>
          {recording ? (
            <CircleStop size={28} color="red" />
          ) : (
            <Circle size={28} color="red" fill="red" />
          )}
        </Pressable>
        {Array.from({ length: 11 }).map((_, index) => (
          <AudioLines key={index} size={20} color="red" />
        ))}
      </HStack>
    </HStack>
  );
};
