import { supabase } from '@/lib/supabase';
import { Note } from '@/models/note';
import { popupWindow } from "@/styles/create-note-style";
import { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
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
  
  // Reset fields when modal closes
  useEffect(() => {
    if (!visible) {
      setTitle("");
      setDescription("");
      setStagedPhoto(null);
      setShowCamera(false);
    }
  }, [visible]);

  if (!visible) return null;

  async function handleSave() {
    if (title.trim().length === 0 || description.trim().length === 0) {
      Alert.alert("Error", "Both title and description are required");
      return;
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) return;

    const { data, error: insertError } = await supabase
      .from('Notes')
      .insert([
        {
          title,
          description,
          userId: session.user.id,
          userEmail: session.user.email,
          imageUrl: stagedPhoto, 
          updatedAt: new Date()
        }
      ])
      .select(); // hent hele raden tilbake

    if (insertError) {
      console.error("Failed to save note:", insertError.message);
      return;
    }

    if (data && data.length > 0) {
      onSave(data[0]); // send hele notatet tilbake til MainScreen
    }

    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={popupWindow.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={popupWindow.modal}>
          <Text style={popupWindow.title}>Create Note</Text>

          {/* Title input */}
          <Text style={popupWindow.label}>Title*</Text>
          <TextInput
            style={popupWindow.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />

          {/* Description */}
          <Text style={popupWindow.label}>Description*</Text>
          <TextInput
            style={popupWindow.textArea}
            placeholder="Write your note..."
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          {/* Add Photo Button */}
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
              <Text style={{ color: "white", fontWeight: "600" }}>Add Photo</Text>
            </TouchableOpacity>
          )}

          {/* Preview av staged photo */}
          {stagedPhoto && (
            <Image
              source={{ uri: stagedPhoto }}
              style={{ width: 200, height: 200, marginTop: 10, alignSelf: 'center', borderRadius: 10 }}
            />
          )}

          {/* Buttons: Cancel & Save */}
          <View style={popupWindow.buttonRow}>
            <TouchableOpacity
              style={popupWindow.cancelBtn}
              onPress={onClose}
            >
              <Text style={popupWindow.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={popupWindow.saveBtn}
              onPress={handleSave}
            >
              <Text style={popupWindow.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

    {/* Camera Modal */}
    {showCamera && (
        <Modal visible={showCamera} animationType="slide">
      <CameraModal
        onPhotoTaken={(uri) => {
        setStagedPhoto(uri); // lagrer photo for preview og senere opplasting
        setShowCamera(false); // lukker modal
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