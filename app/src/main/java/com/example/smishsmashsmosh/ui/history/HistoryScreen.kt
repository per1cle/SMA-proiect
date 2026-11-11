package com.example.smishsmashsmosh.ui.history

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.smishsmashsmosh.domain.model.Status
import com.example.smishsmashsmosh.ui.common.color
import com.example.smishsmashsmosh.ui.common.label
import com.example.smishsmashsmosh.viewmodel.AppViewModelFactory
import com.example.smishsmashsmosh.viewmodel.HistoryViewModel
import java.text.DateFormat
import java.util.Date

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HistoryScreen(
    onBack: () -> Unit,
    onOpen: (Long) -> Unit,
    vm: HistoryViewModel = viewModel(factory = AppViewModelFactory)
) {
    val entries by vm.entries.collectAsStateWithLifecycle()
    val filter by vm.statusFilter.collectAsStateWithLifecycle()
    val query by vm.query.collectAsStateWithLifecycle()

    Scaffold(topBar = {
        TopAppBar(
            title = { Text("Istoric") },
            navigationIcon = { TextButton(onClick = onBack) { Text("Inapoi") } },
            actions = { TextButton(onClick = vm::clear, enabled = entries.isNotEmpty()) { Text("Sterge tot") } }
        )
    }) { pad ->
        Column(Modifier.padding(pad).padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedTextField(
                value = query, onValueChange = { vm.query.value = it },
                label = { Text("Cauta") }, modifier = Modifier.fillMaxWidth(), singleLine = true
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterChip(selected = filter == null, onClick = { vm.statusFilter.value = null }, label = { Text("Toate") })
                listOf(Status.SAFE, Status.SUSPICIOUS, Status.DANGER).forEach {
                    FilterChip(selected = filter == it, onClick = { vm.statusFilter.value = it }, label = { Text(it.label()) })
                }
            }
            if (entries.isEmpty()) Text("Nu exista analize.")
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(entries, key = { it.id }) { e ->
                    Card(Modifier.fillMaxWidth().clickable { onOpen(e.id) }) {
                        Column(Modifier.padding(12.dp)) {
                            Text(e.result.status.label(), fontWeight = FontWeight.Bold, color = e.result.status.color())
                            Text(e.text?.take(80) ?: "(text nepastrat)")
                            if (e.note.isNotBlank()) Text("Notita: ${e.note}", fontWeight = FontWeight.Medium)
                            Text(
                                DateFormat.getDateTimeInstance().format(Date(e.createdAt)) +
                                    (e.sender?.let { " - $it" } ?: ""),
                                style = androidx.compose.material3.MaterialTheme.typography.bodySmall
                            )
                        }
                    }
                }
            }
        }
    }
}


