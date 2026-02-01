import { popupWindow } from "@/styles/create-note-style";
import { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type CreateNoteProps = {
  visible: boolean;
  onClose: () => void;
};

export default function CreateNoteWindow({ visible, onClose }: CreateNoteProps) {

    useEffect(() => {
    if (visible) {
        console.log("Modal opened");
    }
    }, [visible]);
    if (!visible) return null;
  return (

    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={popupWindow.overlay}>
        <View style={popupWindow.modal}>
          <Text style={popupWindow.title}>Create Note</Text>

          {/* Content goes here */}

          <TouchableOpacity onPress={onClose} style={popupWindow.closeBtn}>
            <Text style={popupWindow.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

