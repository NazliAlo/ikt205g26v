import SignOutButton from "@/components/sosial-auth-buttons/sign-out-button";
import { supabase } from "@/lib/supabase";
import { Note } from "@/models/note";
import { mainScreanStyle } from "@/styles/main-screen-style";
import * as Notifications from "expo-notifications";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import CreateNoteWindow from "../components/create-note-popup-window";
import NotesList from "../components/note-list";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,      
    shouldShowBanner: true,   
    shouldShowList: true,       
    shouldPlaySound: false,    
    shouldSetBadge: false,      
  }),
});

export default function MainScreen() {
  const [showCreateNote, setShowCreateNote] = useState(false);
  const [noteList, setNotes] = useState<Note[]>([]);
  const [refresh, setRefresh] = useState(0);
  const params = useLocalSearchParams();

  const [page, setPage] = useState(0); 
  const [loadingMore, setLoadingMore] = useState(false); 
  const PAGE_SIZE = 5;


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
    fetchNotes(0);
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

  async function fetchNotes(pageNumber = 0) {
    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from("Notes")
      .select("*")
      .order("updatedAt", { ascending: false })
      .range(from, to);

    if (error) {
    Alert.alert("Feil", "Kunne ikke hente notater.");
  } else if (data) {
    if (pageNumber === 0) {
      setNotes(data); // første side
    } else {
      setNotes(prev => [...prev, ...data]); // legg til neste sider
    }
  }
}
  


  //handleSaveNote som også sender varsel
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
        body: `Du har opprettet et nytt notat: ${title}`,
      },
      trigger: null, 
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={mainScreanStyle.headerTitle}>Jobb notater</Text>

      {noteList.length === 0 ? (
      <View testID="loader">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading notes...</Text>
      </View>
      ) : (
    <>
    <NotesList 
      notes={noteList}
      onPressNote={(note: Note) =>
        router.push({
          pathname: '/noteDetailScreen',
          params: { note: JSON.stringify(note) }
        })
      }
    />

    {/* Last mer knapp */}
    <TouchableOpacity
      onPress={async () => {
        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchNotes(nextPage);
        setLoadingMore(false);
      }}
      style={{
        position: "absolute",    
        bottom: 20,               
        alignSelf: "center",      
        paddingVertical: 12,
        paddingHorizontal: 24,    
        backgroundColor: "#4F46E5",
        borderRadius: 30,         
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loadingMore ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={{ color: "white", fontWeight: "600" }}>Last mer</Text>
      )}
    </TouchableOpacity>
    </>
    )}
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