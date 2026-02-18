import { Note } from "@/models/note";
import { listStyle } from "@/styles/note-list-style";
import { FlatList, Pressable, Text } from "react-native";

type NotesListProps = {
  notes: Note[];
  onPressNote: (note: Note) => void;
};

export default function NotesList({ notes, onPressNote }: NotesListProps) {

    if (notes.length === 0) {
        return <Text style={listStyle.emptyList}>Your note list is empty!</Text>;
    }
    return (
        <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <Pressable
                onPress={() => onPressNote(item)}
                style={({ pressed }) => [
                    listStyle.item,
                    pressed && { opacity: 0.6 },
                ]}
                >
                <Text style={listStyle.title}>{item.title}</Text>
                <Text style={listStyle.subtitle}>By: {item.userEmail}</Text>

                </Pressable>
        )}
        />
    );
}

