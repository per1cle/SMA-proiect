package com.example.smishsmashsmosh.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.smishsmashsmosh.data.repository.ScanHistoryRepository
import com.example.smishsmashsmosh.domain.model.ScanEntry
import com.example.smishsmashsmosh.domain.model.Status
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@OptIn(ExperimentalCoroutinesApi::class)
class HistoryViewModel(private val repository: ScanHistoryRepository) : ViewModel() {

    val statusFilter = MutableStateFlow<Status?>(null)
    val query = MutableStateFlow("")

    val entries: StateFlow<List<ScanEntry>> =
        combine(statusFilter, query) { s, q -> s to q }
            .flatMapLatest { (s, q) -> repository.search(s, q) }
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

    fun entry(id: Long) = repository.observe(id)

    fun setNote(e: ScanEntry, note: String) = update(e.copy(note = note))
    fun toggleReported(e: ScanEntry) = update(e.copy(reported = !e.reported))
    fun toggleFalsePositive(e: ScanEntry) = update(e.copy(falsePositive = !e.falsePositive))
    fun delete(id: Long) { viewModelScope.launch { repository.delete(id) } }
    fun clear() { viewModelScope.launch { repository.clear() } }

    private fun update(e: ScanEntry) { viewModelScope.launch { repository.update(e) } }
}
