package com.example.smishsmashsmosh.ui.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.smishsmashsmosh.domain.model.AnalysisInput
import com.example.smishsmashsmosh.domain.model.MessageType
import com.example.smishsmashsmosh.domain.model.ScanSource
import com.example.smishsmashsmosh.ui.common.ResultCard
import com.example.smishsmashsmosh.viewmodel.AnalysisUiState
import com.example.smishsmashsmosh.viewmodel.AnalysisViewModel
import com.example.smishsmashsmosh.viewmodel.AppViewModelFactory

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(onOpenHistory: () -> Unit, vm: AnalysisViewModel = viewModel(factory = AppViewModelFactory)) {
    val state by vm.state.collectAsStateWithLifecycle()
    var text by rememberSaveable { mutableStateOf("") }
    var sender by rememberSaveable { mutableStateOf("") }
    var type by rememberSaveable { mutableStateOf(MessageType.SMS) }
    val vibration by vm.vibrationEnabled.collectAsStateWithLifecycle()
    var saveText by rememberSaveable { mutableStateOf(true) }

    Scaffold(topBar = { TopAppBar(title = { Text("SmishSmashSmosh") }) }) { pad ->
        Column(
            Modifier.padding(pad).padding(16.dp).fillMaxSize().verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                MessageType.entries.forEach {
                    FilterChip(selected = type == it, onClick = { type = it }, label = { Text(it.name) })
                }
            }
            OutlinedTextField(
                value = text, onValueChange = { text = it },
                label = { Text("Lipeste mesajul suspect") },
                modifier = Modifier.fillMaxWidth(), minLines = 4
            )
            OutlinedTextField(
                value = sender, onValueChange = { sender = it },
                label = { Text("Expeditor (optional)") }, modifier = Modifier.fillMaxWidth(), singleLine = true
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(selected = saveText, onClick = { saveText = !saveText },
                    label = { Text("Pastreaza textul in istoric") })
            }
            Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                Text("Vibratie la verdict", Modifier.weight(1f), fontSize = 18.sp)
                Switch(checked = vibration, onCheckedChange = vm::setVibration)
            }
            Button(
                onClick = {
                    vm.analyze(
                        AnalysisInput(text.trim(), type, ScanSource.PASTE, sender.ifBlank { null }),
                        saveText
                    )
                    text = ""
                    sender = ""
                },
                enabled = text.isNotBlank() && state !is AnalysisUiState.Loading,
                modifier = Modifier.fillMaxWidth()
            ) { Text("Verifica mesajul", fontSize = 20.sp) }

            when (val s = state) {
                AnalysisUiState.Loading -> CircularProgressIndicator()
                is AnalysisUiState.Success -> ResultCard(s.entry.result)
                is AnalysisUiState.Error -> Text(s.message, color = androidx.compose.material3.MaterialTheme.colorScheme.error)
                AnalysisUiState.Idle -> {}
            }
            OutlinedButton(onClick = onOpenHistory, modifier = Modifier.fillMaxWidth()) { Text("Istoric") }
        }
    }
}

