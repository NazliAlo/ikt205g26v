import { supabase } from "@/lib/supabase";
import { Note } from '@/models/note';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function NoteDetailScreen() {
  const params = useLocalSearchParams();
  const note: Note = JSON.parse(params.note as string); // params.note is a stringified Note
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);

  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
  async function fetchUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setCurrentUserId(session.user.id);
  }
  fetchUser();
}, []);


  async function handleUpdate() {
    if (currentUserId !== note.userId) {
    Alert.alert("Error", "You are not allowed to edit this note!");
    return;
  }
    const {data, error } = await supabase
      .from("Notes")
      .update({
        title: title,
        description: description,
        updatedAt: new Date()
      })
      .eq("id", note.id)
      .select();

    if (error) {
      console.log("ERROR FETCHING NOTES:", error);
      Alert.alert("Error", "Could not update note");
    } else {
      Alert.alert("Success", "Note updated");
      const updatedNote = data[0];
      router.replace({ pathname: '/', params: { updatedNote: JSON.stringify(updatedNote) } });
  
    }
  }

  async function handleDelete() {
  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user?.id;

  if (currentUserId !== note.userId) {
    Alert.alert("Error", "You cannot delete a note you do not own");
    return;
  }

  // Bekreftelse før sletting
  Alert.alert(
    "Confirm Delete",
    "Are you sure you want to delete this note?",
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("Notes")
            .delete()
            .eq("id", note.id);

          if (error) {
            Alert.alert("Error", "Could not delete note");
          } else {
            Alert.alert("Deleted", "Note deleted successfully");
            router.replace({ pathname: '/', params: { deletedNoteId: note.id } });
          }
        }
      }
    ]
  );
}

  console.log(params)
  return (

  <SafeAreaView style={{ flex: 1 }}>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <View style={styles.container}>
        {isEditing ? (
          <TextInput
            style={styles.title}
            value={title}
            onChangeText={setTitle}
          />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}

        {isEditing ? (
          <TextInput
            style={styles.description}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        ) : (
          <Text style={styles.description}>{description}</Text>
        )}

        <Text style={styles.date}>
          Updated at: {new Date(note.updatedAt).toLocaleString()}
        </Text>
      </View>
    </ScrollView>

    {/* Buttons */}
    {currentUserId === note.userId && (
      <TouchableOpacity
    style={styles.editButton}
    onPress={isEditing ? handleUpdate : () => setIsEditing(true)}
     >
    <Text style={styles.backButtonText}>{isEditing ? "Save" : "Edit"}</Text>
    </TouchableOpacity>
    )}

    {currentUserId === note.userId && (
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
         <Text style={styles.backButtonText}>Delete</Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={styles.backButton}
      onPress={() => router.back()}
    >
      <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
  </KeyboardAvoidingView>
</SafeAreaView>

    
  );
}




const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 50,
    fontWeight: "600",
    marginBottom: 16,
    color: "white",
    },
  description: { fontSize: 16, marginBottom: 12, color: "#fff" },
  date: { fontSize: 14, color: '#666' },
  backButton: {
    position: "absolute",
    bottom: 50,      // place it near the bottom
    right: 24,       // same as FAB for consistency
    width: 100,      // wider for text
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4F46E5", // same as your FAB
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // shadow for Android
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  editButton: {
  position: "absolute",
  bottom: 50,
  left: 24,
  width: 100,
  height: 50,
  borderRadius: 25,
  backgroundColor: "#4F46E5",
  justifyContent: "center",
  alignItems: "center",
},

deleteButton: {
  position: "absolute",
  bottom: 50,
  left: 140, // plasser ved siden av Edit-knappen
  width: 100,
  height: 50,
  borderRadius: 25,
  backgroundColor: "#EF4444", // rød for delete
  justifyContent: "center",
  alignItems: "center",
}

});
