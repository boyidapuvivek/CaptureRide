import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Button,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import * as Camera from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import UploadToCloudinary from "../UploadToCloudinary";
import { useNavigation, useRoute } from "@react-navigation/native";

const CameraScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [image, setImage] = useState(null);
  const [uploadedImageName, setUploadedImageName] = useState(false);

  useEffect(() => {
    if (route.params?.imageName) {
      setUploadedImageName(route.params?.imageName);
    }
    (async () => {
      const { status: galleryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (galleryStatus !== "granted" || cameraStatus !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You need to allow camera and gallery access."
        );
      }
    })();
  }, [route.params?.imageName]);

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      } else {
        Alert.alert("Upload Failed", "Could not upload the image. Try again.");
      }
    } catch (err) {
      alert("Something Went Wrong");
      console.log("Error", err);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      } else {
        Alert.alert("Upload Failed", "Could not upload the image. Try again.");
      }
    } catch (err) {
      alert("Something Went Wrong");
      console.log("Error", err);
    }
  };

  const handleUpload = async () => {
    if (!image) return Alert.alert("Select an image first");

    // setUploading(true);
    const cloudinaryUrl = await UploadToCloudinary(image);
    console.log(cloudinaryUrl);

    if (cloudinaryUrl) {
      navigation.navigate("AddRide", {
        imageURL: cloudinaryUrl,
        imageName: uploadedImageName,
      });
    }

    // setUploading(false);
  };

  return (
    <View style={{ alignItems: "center", marginTop: 50 }}>
      <Button
        title="Take Photo"
        onPress={() => {
          takePhoto();
        }}
      />
      <Button title="Pick from Gallery" onPress={() => pickImage()} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
        />
      )}
      {image && <Button title="Upload" onPress={handleUpload} />}
      {/* {uploading && <ActivityIndicator size="large" color="#0000ff" />} */}
    </View>
  );
};

export default CameraScreen;
