import SignOutButton from "@/components/sosial-auth-buttons/sign-out-button";
import { Note } from "@/models/note";
import { mainScreanStyle } from "@/styles/main-screen-style";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CreateNoteWindow from "../components/create-note-popup-window";
import NotesList from "../components/note-list";

export default function MainScreen() {
    const [showCreateNote, setShowCreateNote] = useState(false);
    const [noteList, setNotes] = useState<Note[]>([]);
    
    function handleSaveNote(title: string, description: string) {
        console.log("SAVE:", title, description);
        const newNote: Note = {
            id: Date.now().toString(), // unik id
            title,
            description,
            createdAt: new Date()
        };
    // legg til notatet i listen
    setNotes(prevNotes => [newNote, ...prevNotes]); // legger nye øverst
    }


    return (

        <View style={{ flex: 1 }}>
            <Text style ={mainScreanStyle.headerTitle} >Jobb notater</Text>
           <NotesList 
                notes = {noteList}
                onPressNote={(note: Note) => router.push({ pathname: '/noteDetailScreen', params: { note: JSON.stringify(note) } })}

            />
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
                onSave={handleSaveNote}             
            />
            <SignOutButton/>
        </View>
    );
}


