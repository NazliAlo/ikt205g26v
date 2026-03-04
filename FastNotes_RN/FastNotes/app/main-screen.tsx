import SignOutButton from "@/components/sosial-auth-buttons/sign-out-button";
import { supabase } from "@/lib/supabase";
import { Note } from "@/models/note";
import { mainScreanStyle } from "@/styles/main-screen-style";
import * as Notifications from "expo-notifications";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import CreateNoteWindow from "../components/create-note-popup-window";
import NotesList from "../components/note-list";


// Håndter notifikasjoner i forgrunn
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,      // vis alert-popup
    shouldShowBanner: true,     // vis banner på iOS
    shouldShowList: true,       // vis i notifikasjonslisten
    shouldPlaySound: false,     // spill av lyd
    shouldSetBadge: false,      // oppdater app-badge
  }),
});

export default function MainScreen() {
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [noteList, setNotes] = useState<Note[]>([]);
  const [refresh, setRefresh] = useState(0);
  const params = useLocalSearchParams();

  // Be om notif-tillatelser når komponenten mountes
  useEffect(() => {
    const askPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "denied") {
        Alert.alert(
          "Tillat varsler",
          "Du må gi tillatelse til varsler for å motta notifikasjoner."
        );
      }
    };
    askPermissions();
  }, []);

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

  // ⚡ Trigger et lokalt varsel når en ny note legges til
  const triggerLocalNotification = async (noteTitle: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Nytt notat: ${noteTitle}`,
        body: "Sjekk notatet ditt i appen!",
      },
      trigger: null, // umiddelbart
    });
  };

  // ⚡ Oppdatert handleSaveNote som også sender varsel
  async function handleSaveNote(newNote: Note) {
    setNotes(prevNotes => [newNote, ...prevNotes]); // legg til på toppen
    setShowCreateNote(false);

    // Trigger lokalt varsel
    await sendTestNotification(newNote.title);
  }
  

    // -------------------
  // Funksjon for test-varsler
  // -------------------
  const sendTestNotification = async (title: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Nytt notat: ${title}`,
        body: "Dette er en testnotifikasjon",
      },
      trigger: null, // null = vis umiddelbart
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={mainScreanStyle.headerTitle}>Jobb notater</Text>

      <NotesList 
        notes={noteList}
        onPressNote={(note: Note) =>
          router.push({
            pathname: '/noteDetailScreen',
            params: { note: JSON.stringify(note) }
          })
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={mainScreanStyle.fab}
        onPress={() => setShowCreateNote(true)}
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