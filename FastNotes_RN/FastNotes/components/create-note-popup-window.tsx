import { popupWindow } from "@/styles/create-note-style";
import { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, TextInput } from "react-native";

type CreateNoteProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
};

export default function CreateNoteWindow({ visible, onClose, onSave }: CreateNoteProps) {
  const [title, setTitle] = useState ("");
  const [description, setDescription] = useState ("");

  useEffect(() => {
  if (visible) {
      console.log("Modal opened");
  }
  else {
      setTitle("");
      setDescription("");
    }
  
  }, [visible]);
  if (!visible) return null;
  
  function handleSave() {
    if (title.trim().length === 0) return;
    onSave(title, description);
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
          <Text style={popupWindow.label}>Description</Text>
          <TextInput
            style={popupWindow.textArea}
            placeholder="Write your note..."
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          {/* Buttons */}
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
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

