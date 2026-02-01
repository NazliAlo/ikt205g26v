import { listStyle } from "@/styles/note-list-style";
import { View, Text, FlatList, StyleSheet } from "react-native";

const notes = [
  { id: "1", title: "Buy groceries" },
  { id: "2", title: "Meeting notes" },
  { id: "3", title: "Ideas for app" },
];

export default function NotesList() {
  return (
    <FlatList
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={listStyle.item}>
          <Text style={listStyle.title}>{item.title}</Text>
        </View>
      )}
    />
  );
}
