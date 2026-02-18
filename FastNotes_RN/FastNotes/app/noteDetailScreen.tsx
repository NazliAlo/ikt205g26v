import { Note } from '@/models/note';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function NoteDetailScreen() {
  const params = useLocalSearchParams();
  const note: Note = JSON.parse(params.note as string); // params.note is a stringified Note
  console.log(params)
  return (
    <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
          <Text style={styles.title}>{note.title}</Text>
          <Text style={styles.description}>{note.description}</Text>
          <Text style={styles.date}>Created at: {new Date(note.updatedAt).toString()}</Text>

        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {router.back()}}
          >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
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
});
