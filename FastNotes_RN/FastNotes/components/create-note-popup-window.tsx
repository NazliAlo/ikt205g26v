import { supabase } from '@/lib/supabase';
import { Note } from '@/models/note';
import { popupWindow } from "@/styles/create-note-style";
import * as FileSystem from "expo-file-system/legacy";
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

  // IMAGE VALIDATION
  const validateImage = async (uri: string) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }

    const maxSize = 15 * 1024 * 1024; // 15MB
    if (fileInfo.size && fileInfo.size > maxSize) {
      throw new Error("Image must be under 15MB");
    }

    const allowedFormats = ["jpg", "jpeg", "png", "webp"];
    const extension = uri.split(".").pop()?.toLowerCase();

    if (!extension || !allowedFormats.includes(extension)) {
      throw new Error("Only JPG, PNG or WebP images are allowed");
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
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from("note-pics")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ✅ HANDLE SAVE
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
      const extension = await validateImage(stagedPhoto);  // 1️⃣ valider
      imageUrl = await uploadImage(stagedPhoto, extension, session.user.id); // 2️⃣ upload + få publicUrl
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
    Alert.alert("Error", error.message);
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
                width: 200,
                height: 200,
                marginTop: 10,
                alignSelf: 'center',
                borderRadius: 10
              }}
              resizeMode="cover"
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
                uploading && { opacity: 0.6 }
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