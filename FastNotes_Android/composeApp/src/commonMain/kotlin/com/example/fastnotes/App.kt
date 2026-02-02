package com.example.fastnotes

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.MaterialTheme.colorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.example.fastnotes.ui.MainScreen
//colorScheme = darkColorScheme()
@Composable
@Preview
fun App() {
    MaterialTheme(  )
    {
        MainScreen()
    }
}
