import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import { Alert, Button, Image, Text, View } from "react-native";

type Props = {
  onPhotoTaken: (uri: string) => void;
  onClose?: () => void; // valgfri, for å lukke modalen fra parent
};

export default function CameraModal({ onPhotoTaken, onClose }: Props) {
  // Kamera-tillatelse
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  // Galleri-tillatelse
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  // Be om galleri-tillatelse når modalen åpnes
  useEffect(() => {
    const getGalleryPermission = async () => {
      const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
      setGalleryPermission(status === "granted");
    };
    getGalleryPermission();
  }, []);

  // ---------------------
  // Funksjoner for å be om tillatelser
  // ---------------------
  const askCameraPermission = async () => {
    const result = await requestCameraPermission();
    if (!result.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to allow camera access to take photos. Enable it in your settings if needed."
      );
    }
  };

  const askGalleryPermission = async () => {
    const { status, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status === "granted") {
      setGalleryPermission(true);
      return;
    }

    if (canAskAgain) {
      const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const granted = newStatus === "granted";
      setGalleryPermission(granted);
      if (!granted) {
        Alert.alert(
          "Permission Denied",
          "Gallery access is required to pick photos. You can enable it in settings."
        );
      }
    } else {
      Alert.alert(
        "Permission Denied",
        "Gallery access was denied permanently. Please enable it in your device settings."
      );
    }
  };

  // ---------------------
  // UI: Tillatelser
  // ---------------------
  if (cameraPermission?.granted === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          Camera access is required to take photos. Please grant permission.
        </Text>
        <Button title="Give Camera Access" onPress={askCameraPermission} />
        <View style={{ height: 10 }} />
        {onClose && <Button title="Go Back" onPress={onClose} color="gray" />}
      </View>
    );
  }

  if (galleryPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          Gallery access is required to pick photos. Please grant permission.
        </Text>
        <Button title="Give Gallery Access" onPress={askGalleryPermission} />
        <View style={{ height: 10 }} />
        {onClose && <Button title="Go Back" onPress={onClose} color="gray" />}
      </View>
    );
  }

  // ---------------------
  // Funksjoner for bilder
  // ---------------------
  const takePicture = async () => {
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setPhotoUri(data.uri);
    }
  };

  const pickImageFromGallery = async () => {
    if (!galleryPermission) {
      Alert.alert("Permission required", "Gallery permission not granted!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // ---------------------
  // UI for kamera/galleri og preview
  // ---------------------
  return (
    <View style={{ flex: 1 }}>
      {!photoUri ? (
        <CameraView style={{ flex: 1 }} ref={cameraRef}>
          <View
            style={{
              position: "absolute",
              bottom: 20,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button title="📸 Take Picture" onPress={takePicture} />
            <Button title="🖼 Pick from Gallery" onPress={pickImageFromGallery} />
            {onClose && <Button title="❌ Close" onPress={onClose} />}
          </View>
        </CameraView>
      ) : (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: photoUri }} style={{ flex: 1 }} />
          <View
            style={{
              position: "absolute",
              bottom: 20,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button title="Use This Photo" onPress={() => onPhotoTaken(photoUri)} />
            <Button title="Retake" onPress={() => setPhotoUri(null)} />
            {onClose && <Button title="❌ Close" onPress={onClose} />}
          </View>
        </View>
      )}
    </View>
  );
}









