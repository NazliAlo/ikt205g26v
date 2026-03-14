import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";


type Props = {
  onPhotoTaken: (uri: string) => void;
  onClose?: () => void;
};

export default function CameraModal({ onPhotoTaken, onClose }: Props) {
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();
  const [galleryPermission, setGalleryPermission] =
    useState<boolean | null>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
    const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const cameraRef = useRef<CameraView>(null);

  // ---------------------
  // Custom Button Component
  // ---------------------
  const ActionButton = ({
    title,
    onPress,
    variant = "primary",
  }: {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "danger";
  }) => {
    const backgroundColor =
      variant === "primary"
        ? "#4F46E5"
        : variant === "danger"
        ? "#DC2626"
        : "rgba(255,255,255,0.9)";

    const textColor =
      variant === "secondary" ? "#111" : "white";

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor,
          paddingVertical: 12,
          paddingHorizontal: 18,
          borderRadius: 30,
          minWidth: 110,
          alignItems: "center",
          elevation: 3,
        }}
      >
        <Text
          style={{
            color: textColor,
            fontWeight: "600",
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  // ---------------------
  // Permissions
  // ---------------------
  useEffect(() => {
    const getGalleryPermission = async () => {
      const { status } =
        await ImagePicker.getMediaLibraryPermissionsAsync();
      setGalleryPermission(status === "granted");
    };
    getGalleryPermission();
  }, []);

  const askCameraPermission = async () => {
    const result = await requestCameraPermission();
    if (!result.granted) {
      Alert.alert(
        "Permission Denied",
        "You need to allow camera access."
      );
    }
  };

  const askGalleryPermission = async () => {
    const { status, canAskAgain } =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    if (status === "granted") {
      setGalleryPermission(true);
      return;
    }

    if (canAskAgain) {
      const { status: newStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const granted = newStatus === "granted";
      setGalleryPermission(granted);

      if (!granted) {
        Alert.alert(
          "Permission Denied",
          "Gallery access is required."
        );
      }
    } else {
      Alert.alert(
        "Permission Denied",
        "Enable gallery access in device settings."
      );
    }
  };

  // ---------------------
  // Permission Screens
  // ---------------------
  if (cameraPermission?.granted === false) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Camera access is required.
        </Text>

        <ActionButton
          title="Give Camera Access"
          onPress={askCameraPermission}
        />

        {onClose && (
          <View style={{ marginTop: 15 }}>
            <ActionButton
              title="Go Back"
              onPress={onClose}
              variant="secondary"
            />
          </View>
        )}
      </View>
    );
  }

  if (galleryPermission === false) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Gallery access is required.
        </Text>

        <ActionButton
          title="Give Gallery Access"
          onPress={askGalleryPermission}
        />

        {onClose && (
          <View style={{ marginTop: 15 }}>
            <ActionButton
              title="Go Back"
              onPress={onClose}
              variant="secondary"
            />
          </View>
        )}
      </View>
    );
  }

  // ---------------------
  // Photo Functions
  // ---------------------
  const takePicture = async () => {
    if (cameraRef.current) {
      const data =
        await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
      setPhotoUri(data.uri);
    }
  };

  const pickImageFromGallery = async () => {
    if (!galleryPermission) {
      Alert.alert(
        "Permission required",
        "Gallery permission not granted!"
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // ---------------------
  // Main UI
  // ---------------------
  return (
    <View style={{ flex: 1 }}>
      {!photoUri ? (
        <CameraView
          style={{ flex: 1 }}
          ref={cameraRef}
        >
          <View
            style={{
              position: "absolute",
              bottom: 30,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              paddingHorizontal: 15,
              backgroundColor: "rgba(0,0,0,0.3)",
              paddingVertical: 12,
              borderRadius: 25,
              marginHorizontal: 10,
            }}
          >
            <ActionButton
              title="📸 Take"
              onPress={takePicture}
              variant="primary"
            />

            <ActionButton
              title="🖼 Gallery"
              onPress={pickImageFromGallery}
              variant="secondary"
            />

            {onClose && (
              <ActionButton
                title="✖"
                onPress={onClose}
                variant="danger"
              />
            )}
          </View>
        </CameraView>
      ) : (
       <View style={{ flex: 1, justifyContent: "center", alignItems: "center",  backgroundColor: "black", }}>
          <Image
            source={{ uri: photoUri }}
            style={{
              width: screenWidth * 0.9,   
              height: screenHeight * 0.6, 
            }}
            resizeMode="contain"
          />

          <View
            style={{
              position: "absolute",
              bottom: 30,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-evenly",
              paddingHorizontal: 15,
              backgroundColor: "rgba(0,0,0,0.3)",
              paddingVertical: 12,
              borderRadius: 25,
              marginHorizontal: 10,
            }}
          >
            <ActionButton
              title="Use Photo"
              onPress={() =>
                photoUri && onPhotoTaken(photoUri)
              }
              variant="primary"
            />

            <ActionButton
              title="Retake"
              onPress={() => setPhotoUri(null)}
              variant="secondary"
            />

            {onClose && (
              <ActionButton
                title="✖"
                onPress={onClose}
                variant="danger"
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}