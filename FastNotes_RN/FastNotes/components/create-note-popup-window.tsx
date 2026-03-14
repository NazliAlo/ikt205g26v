import { supabase } from '@/lib/supabase';
import { Note } from '@/models/note';
import { popupWindow } from "@/styles/create-note-style";
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import CameraModal from "./cameraModal";

type CreateNoteProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (newNote: Note) => void;
};

export default function CreateNoteWindow({ visible, onClose, onSave }: CreateNoteProps) {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [showCamera, setShowCamera] = useState(false);
  const [stagedPhoto, setStagedPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setTitle("");
      setDescription("");
      setStagedPhoto(null);
      setShowCamera(false);
      setUploading(false);
    }
  }, [visible]);

  if (!visible) return null;

  const convertToJpeg = async (uri: string) => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [],
    {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  return result.uri;
  };

  // IMAGE VALIDATION
  const validateImage = async (uri: string) => {
  const fileInfo = await FileSystem.getInfoAsync(uri);

  if (!fileInfo.exists) {
    throw {
      type: "file",
      message: "The selected image could not be found."
    };
  }

  const maxSize = 15 * 1024 * 1024; // 15MB

  if (fileInfo.size && fileInfo.size > maxSize) {
    throw {
      type: "size",
      message: "The image is too large. Maximum allowed size is 15MB."
    };
  }

  const allowedFormats = ["jpg", "jpeg", "png", "webp"];
  const extension = uri.split(".").pop()?.toLowerCase();

  if (!extension || !allowedFormats.includes(extension)) {
    throw {
      type: "format",
      message: "Invalid file format. Please select a JPG, PNG or WebP image."
    };
  }

  return extension;
};
  // IMAGE UPLOAD
  const uploadImage = async (
    uri: string,
    extension: string,
    userId: string
  ) => {
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    const fileName = `${userId}_${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("note-pics")
      .upload(fileName, arrayBuffer, {
        contentType: `image/${extension}`,
        upsert: false,
      });

    if (error) {
  throw {
    type: "upload",
    message: "Upload failed. Please check your internet connection and try again."
  };
}

    const { data } = supabase.storage
      .from("note-pics")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  //HANDLE SAVE
  async function handleSave() {

  if (title.trim().length === 0 || description.trim().length === 0) {
    Alert.alert("Error", "Both title and description are required");
    return;
  }

  try {
    setUploading(true);

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) throw new Error("User not authenticated");

    let imageUrl: string | null = null;

 
    if (stagedPhoto) {

  const convertedUri = await convertToJpeg(stagedPhoto);

  
  await validateImage(convertedUri);
  const extension = "jpg";

  imageUrl = await uploadImage(convertedUri, extension, session.user.id);
}
    const { data, error: insertError } = await supabase
      .from('Notes')
      .insert([
        {
          title,
          description,
          userId: session.user.id,
          userEmail: session.user.email,
          imageUrl: imageUrl, 
          updatedAt: new Date()
        }
      ])
      .select();

    if (insertError) {
      throw new Error(insertError.message);
    }

    if (data && data.length > 0) {
      onSave(data[0]);
    }

    onClose();

  } catch (error: any) {

  if (error?.type === "size") {
    Alert.alert("Image Too Large", error.message);
  } 
  else if (error?.type === "format") {
    Alert.alert("Invalid Image Format", error.message);
  }
  else if (error?.type === "upload") {
    Alert.alert("Upload Failed", error.message);
  }
  else if (error?.type === "file") {
    Alert.alert("File Error", error.message);
  }
  else {
    Alert.alert(
      "Unexpected Error",
      "Something went wrong. Please try again."
    );
  }
} finally {
    setUploading(false);
  }
}

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={popupWindow.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={popupWindow.modal}>

          <Text style={popupWindow.title}>Create Note</Text>

          <Text style={popupWindow.label}>Title*</Text>
          <TextInput
            style={popupWindow.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={popupWindow.label}>Description*</Text>
          <TextInput
            style={popupWindow.textArea}
            placeholder="Write your note..."
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          {/* Add Photo */}
          {!stagedPhoto && (
            <TouchableOpacity
              style={{
                backgroundColor: "#4F46E5",
                padding: 12,
                marginTop: 10,
                borderRadius: 8,
                alignItems: "center",
              }}
              onPress={() => setShowCamera(true)}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Add Photo
              </Text>
            </TouchableOpacity>
          )}

          {/* Preview */}
          {stagedPhoto && (
          <Image
            source={{ uri: stagedPhoto }}
            style={{
              width: 300,          
              height: 300,         
              marginTop: 10,
              alignSelf: 'center',
              borderRadius: 10
            }}
            resizeMode="contain"   
          />
        )}

          {/* Buttons */}
          <View style={popupWindow.buttonRow}>
            <TouchableOpacity
              style={popupWindow.cancelBtn}
              onPress={onClose}
              disabled={uploading}
            >
              <Text style={popupWindow.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                popupWindow.saveBtn,
                uploading && {
                  opacity: 0.5,
                  backgroundColor: "#9CA3AF", 
                }
              ]}
              onPress={handleSave}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={popupWindow.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Camera Modal */}
          {showCamera && (
            <Modal visible={showCamera} animationType="slide">
              <CameraModal
                onPhotoTaken={(uri) => {
                  setStagedPhoto(uri);
                  setShowCamera(false);
                }}
                onClose={() => setShowCamera(false)}
              />
            </Modal>
          )}

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}