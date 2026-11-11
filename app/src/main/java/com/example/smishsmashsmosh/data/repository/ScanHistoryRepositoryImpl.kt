package com.example.smishsmashsmosh.data.repository

import com.example.smishsmashsmosh.data.local.ScanDao
import com.example.smishsmashsmosh.data.mapper.toDomain
import com.example.smishsmashsmosh.data.mapper.toEntity
import com.example.smishsmashsmosh.domain.model.ScanEntry
import com.example.smishsmashsmosh.domain.model.Status
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class ScanHistoryRepositoryImpl(private val dao: ScanDao) : ScanHistoryRepository {
    override suspend fun add(entry: ScanEntry) = dao.insert(entry.toEntity())
    override fun observeAll(): Flow<List<ScanEntry>> = dao.observeAll().map { l -> l.map { it.toDomain() } }
    override fun observe(id: Long): Flow<ScanEntry?> = dao.observeById(id).map { it?.toDomain() }
    override fun search(status: Status?, query: String): Flow<List<ScanEntry>> =
        dao.search(status?.name, query.trim()).map { l -> l.map { it.toDomain() } }
    override suspend fun update(entry: ScanEntry) = dao.update(entry.toEntity())
    override suspend fun delete(id: Long) = dao.deleteById(id)
    override suspend fun clear() = dao.deleteAll()
}
