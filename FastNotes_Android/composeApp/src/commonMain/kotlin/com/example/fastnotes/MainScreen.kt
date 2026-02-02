package com.example.fastnotes.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.fastnotes.NewNoteWindow
import com.example.fastnotes.model.Note



@OptIn(ExperimentalMaterial3Api::class)
@Composable

fun MainScreen() {
    val notes = remember {
        mutableStateListOf<Note>(
            // Note(1, "Handleliste", "Melk, egg, brød"),
            // Note(2, "Ideer", "Lag FastNotes appen ferdig"),
            // Note(3, "Påminnelse", "Drikk vann")
        )
    }

    var showNewNote by remember { mutableStateOf(false) }
    var selectedNote by remember { mutableStateOf<Note?>(null) }


    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("My Notes") }
            )
        },

        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    showNewNote = true
                }
            ) {
                Text(
                    text = "+",
                    style = MaterialTheme.typography.headlineMedium
                ) }
        }
    )
    { padding ->
        Box(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
        ) {
            if (notes.isEmpty()) {
                Text(
                    text = "Your note list is empty!",
                    style = MaterialTheme.typography.bodyLarge,
                    modifier = Modifier.align(Alignment.Center)
                )

            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(notes) { note ->
                        NoteItem(
                            note = note,
                            onClick = { selectedNote = note }
                        )
                    }
                }
            }
        }
    }
    if (showNewNote) {
        NewNoteWindow(
            onDismiss = { showNewNote = false },
            onSave = { title, content ->

                val newNote = Note(
                    id = (notes.maxOfOrNull { it.id } ?: 0) + 1,
                    title = title,
                    content = content
                )
                notes.add(0, newNote)
                showNewNote = false
            }
        )
    }
}

@Composable
fun NoteItem(note: Note, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth(),
        onClick = onClick
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = note.title,
                style = MaterialTheme.typography.titleMedium
            )
        }
    }
}
