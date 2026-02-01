import { useState } from "react";
import { mainScreanStyle } from "@/styles/main-screen-style"
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import CreateNoteWindow from "./create-note-popup-window";
import NotesList from "./note-list";
import { Note } from "@/models/note";

export default function MainScreen() {
    const [showCreateNote, setShowCreateNote] = useState(false);
    const [noteList, setNotes] = useState<Note[]>([]);


    return (

        <View style={{ flex: 1 }}>
            <Text style ={mainScreanStyle.headerTitle} >My notes</Text>
           <NotesList notes = {noteList}/>
            {/* FAB */}
            <TouchableOpacity
                style={mainScreanStyle.fab}
                onPress={() => {
                    console.log("FAB PRESSED");
                    setShowCreateNote(true);
                }}
                >
                <Text style={mainScreanStyle.fabText}>+</Text>
            </TouchableOpacity>

            {/* Popup */}
            <CreateNoteWindow
                visible={showCreateNote}
                onClose={() => setShowCreateNote(false)}
            />
        </View>
    );
}


