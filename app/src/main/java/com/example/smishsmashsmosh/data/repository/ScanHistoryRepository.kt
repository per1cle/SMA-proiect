package com.example.smishsmashsmosh.data.repository

import com.example.smishsmashsmosh.domain.model.ScanEntry
import com.example.smishsmashsmosh.domain.model.Status
import kotlinx.coroutines.flow.Flow

interface ScanHistoryRepository {
    suspend fun add(entry: ScanEntry): Long                                   // Create
    fun observeAll(): Flow<List<ScanEntry>>                                   // Read
    fun observe(id: Long): Flow<ScanEntry?>
    fun search(status: Status? = null, query: String = ""): Flow<List<ScanEntry>>
    suspend fun update(entry: ScanEntry)                                      // Update
    suspend fun delete(id: Long)                                              // Delete
    suspend fun clear()
}
