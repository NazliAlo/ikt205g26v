import SignOutButton from "@/components/sosial-auth-buttons/sign-out-button";
import { supabase } from "@/lib/supabase";
import { Note } from "@/models/note";
import { mainScreanStyle } from "@/styles/main-screen-style";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CreateNoteWindow from "../components/create-note-popup-window";
import NotesList from "../components/note-list";

export default function MainScreen() {
    const [showCreateNote, setShowCreateNote] = useState(false);
    const [noteList, setNotes] = useState<Note[]>([]);
    const [refresh, setRefresh] = useState(0);
    const params = useLocalSearchParams();

    useEffect(() => {
        fetchNotes();
    }, [refresh]);
    
    useEffect(() => {
        if (params.updatedNote) {
            const updatedNote: Note = JSON.parse(params.updatedNote as string);
            setNotes(prevNotes =>
            prevNotes.map(n => (n.id === updatedNote.id ? updatedNote : n))
        );
     }
    }, [params.updatedNote]);  

    useEffect(() => {
    if (params.deletedNoteId) {
        setNotes(prevNotes => prevNotes.filter(n => n.id !== params.deletedNoteId));
    }
    }, [params.deletedNoteId]);


    async function fetchNotes() {
        const { data, error } = await supabase
            .from("Notes")
            .select("*")
            .order("updatedAt", { ascending: false });

        if (error) {
            console.log("ERROR FETCHING NOTES:", error);
        } else if (data) {
            setNotes(data);
        }
    }

async function handleSaveNote(newNote: Note) {
    setNotes(prevNotes => [newNote, ...prevNotes]); // legg til på toppen
    setShowCreateNote(false);
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


