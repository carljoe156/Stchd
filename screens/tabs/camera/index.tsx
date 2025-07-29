import React from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Button, Text, TouchableOpacity, View, Image } from "react-native";
import { CheckCircle, Circle } from "lucide-react-native";
import { usePost } from "@/providers/PostProvider";
import { router, useLocalSearchParams } from "expo-router";

export default () => {
  const { threadId } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = React.useRef<CameraView>(null);
  const { uploadFile, photo, setPhoto } = usePost();

  const takePhoto = async () => {
    if (cameraRef.current && threadId) {
      const photo = await cameraRef.current.takePictureAsync();
      if (!photo) return;

      setPhoto(photo.uri);
      let filename = photo.uri.split("/").pop();
      if (!filename) return;
      uploadFile(threadId, photo.uri, `image/${filename.split(".").pop()}`, filename);
      // console.log(photo);
    }
  };

  if (!permission) return null;

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-center text-lg">We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (photo)
    return (
      <View className="flex-1 items-center justify-center">
        <Image source={{ uri: photo }} className="h-full w-full absolute" />
        <TouchableOpacity
          className="bg-white rounded-full p-2"
          onPress={() => {
            router.back();
          }}
          style={{ marginBottom: 50 }}
        >
          <CheckCircle size={75} color="black" />
        </TouchableOpacity>
      </View>
    );
  return (
    <CameraView style={{ flex: 1, padding: 50 }} facing={"back"} ref={cameraRef}>
      <View className="flex-1 flex-row justify-end items-end">
        <TouchableOpacity className="flex-1 items-center" onPress={takePhoto}>
          <Circle size={75} color="white" />
        </TouchableOpacity>
      </View>
    </CameraView>
  );
};
