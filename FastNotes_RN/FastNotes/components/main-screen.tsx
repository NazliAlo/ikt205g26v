import { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import CreateNoteWindow from "./create-note-popup-window";

export default function MainScreen() {
    const [showCreateNote, setShowCreateNote] = useState(false);

    return (

        <View style={{ flex: 1 }}>
            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    console.log("FAB PRESSED");
                    setShowCreateNote(true);
                }}
                >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            {/* Popup */}
            <CreateNoteWindow
                visible={showCreateNote}
                onClose={() => setShowCreateNote(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24, // 👈 thumb-zone for right-handed users
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
});
