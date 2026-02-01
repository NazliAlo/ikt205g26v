import { Note } from "@/models/note";
import { listStyle } from "@/styles/note-list-style";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";

type NotesListProps = {
  notes: Note[];
};

export default function NotesList({ notes }: NotesListProps) {

    if (notes.length === 0) {
        return <Text style={listStyle.emptyList}>Your note list is empty!</Text>;
    }
    return (
        <FlatList
        
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <Pressable
                onPress={() => console.log("Pressed:", item.id)}
                style={({ pressed }) => [
                    listStyle.item,
                    pressed && { opacity: 0.6 },
                ]}
                >
                <Text style={listStyle.title}>{item.title}</Text>
                </Pressable>
        )}
        />
    );
}

