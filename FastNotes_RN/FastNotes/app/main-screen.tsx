import SignOutButton from "@/components/sosial-auth-buttons/sign-out-button";
import { supabase } from "@/lib/supabase";
import { Note } from "@/models/note";
import { mainScreanStyle } from "@/styles/main-screen-style";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CreateNoteWindow from "../components/create-note-popup-window";
import NotesList from "../components/note-list";

export default function MainScreen() {
    const [showCreateNote, setShowCreateNote] = useState(false);
    const [noteList, setNotes] = useState<Note[]>([]);


        useEffect(() => {
        fetchNotes();
    }, []);

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

   async function handleSaveNote(title: string, description: string) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase.from("Notes").insert([
            {
                title,
                description,
                user_id: session.user.id,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);

        if (!error) {
            fetchNotes();
        }
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


