package com.example.smishsmashsmosh.ui.history

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.smishsmashsmosh.ui.common.ResultCard
import com.example.smishsmashsmosh.viewmodel.AppViewModelFactory
import com.example.smishsmashsmosh.viewmodel.HistoryViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailScreen(id: Long, onBack: () -> Unit, vm: HistoryViewModel = viewModel(factory = AppViewModelFactory)) {
    val entry by remember(id) { vm.entry(id) }.collectAsStateWithLifecycle(initialValue = null)
    var saved by remember(id) { mutableStateOf(false) }
    val e = entry

    Scaffold(topBar = {
        TopAppBar(title = { Text("Detalii") }, navigationIcon = { TextButton(onClick = onBack) { Text("Inapoi") } })
    }) { pad ->
        if (e == null) {
            Text("Nu exista intrarea.", Modifier.padding(pad).padding(16.dp))
            return@Scaffold
        }
        Column(
            Modifier.padding(pad).imePadding().padding(16.dp).verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            var note by remember(e.id) { mutableStateOf(e.note) }
            ResultCard(e.result)
            Text("Mesaj (${e.type}, ${e.source}):")
            Text(e.text ?: "(text nepastrat)")
            e.sender?.let { Text("Expeditor: $it") }
            if (e.note.isNotBlank()) Text("Notita ta: ${e.note}", style = androidx.compose.material3.MaterialTheme.typography.titleMedium)
            OutlinedTextField(
                value = note, onValueChange = { note = it; saved = false },
                label = { Text("Notita") }, modifier = Modifier.fillMaxWidth()
            )
            Button(onClick = { vm.setNote(e, note); note = ""; saved = true }, modifier = Modifier.fillMaxWidth()) { Text("Salveaza notita") }
            if (saved) Text("Notita salvata")
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(selected = e.reported, onClick = { vm.toggleReported(e) }, label = { Text("Raportat") })
                FilterChip(selected = e.falsePositive, onClick = { vm.toggleFalsePositive(e) }, label = { Text("Fals pozitiv") })
            }
            OutlinedButton(
                onClick = { vm.delete(e.id); onBack() },
                modifier = Modifier.fillMaxWidth()
            ) { Text("Sterge") }
        }
    }
}




