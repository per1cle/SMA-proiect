package com.example.smishsmashsmosh

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.example.smishsmashsmosh.ui.AppNavigation
import com.example.smishsmashsmosh.ui.theme.SmishSmashSmoshTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent { SmishSmashSmoshTheme { AppNavigation() } }
    }
}
