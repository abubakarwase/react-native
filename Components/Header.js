import React, { useEffect, useState } from "react";
import { Appbar, Text } from "react-native-paper";
import {
  StyleSheet,
  View,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
  Share,
} from "react-native";
import * as Location from "expo-location";
import CameraRoll from "@react-native-community/cameraroll";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import * as ScreenCapture from "expo-screen-capture";

// import CaptureScreen
import ViewShot, { captureScreen, captureRef } from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

async function hasPermissionToSave() {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(permission);
  return status === "granted";
}

async function savePicture(localUri) {
  if (Platform.OS === "android" && !(await hasPermissionToSave())) {
    return;
  }

  const fileName = localUri.split("/").pop();
  const newPath = FileSystem.documentDirectory + fileName;
  try {
    await FileSystem.moveAsync({
      from: localUri,
      to: newPath,
    });
    console.log("success");
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const Header = () => {
  async function getCameraPermission() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    // let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      ScreenCapture.addScreenshotListener(() => {
        console.log("in screen listener");
        Alert.alert("You took a screenshot");
      });
    }
  }
  const _handleMore = () => console.log("show more");
  const [imageURI, setImageURI] = useState("");
  const [savedImagePath, setSavedImagePath] = useState("");

  return (
    <>
      <Appbar.Header
        style={{ backgroundColor: "#5e6472", height: "5%" }}
      ></Appbar.Header>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
  },
  titleText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
  textStyle: {
    textAlign: "center",
    padding: 10,
  },
  buttonStyle: {
    fontSize: 16,
    color: "white",
    backgroundColor: "green",
    padding: 5,
    minWidth: 250,
  },
  buttonTextStyle: {
    padding: 5,
    color: "white",
    textAlign: "center",
  },
});

export default Header;
