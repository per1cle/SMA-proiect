package com.example.smishsmashsmosh.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface ScanDao {
    @Insert suspend fun insert(entity: ScanEntity): Long

    @Query("SELECT * FROM scan_entries ORDER BY createdAt DESC")
    fun observeAll(): Flow<List<ScanEntity>>

    @Query("SELECT * FROM scan_entries WHERE id = :id")
    fun observeById(id: Long): Flow<ScanEntity?>

    @Query(
        "SELECT * FROM scan_entries WHERE (:status IS NULL OR status = :status) " +
            "AND (:query = '' OR text LIKE '%' || :query || '%' OR sender LIKE '%' || :query || '%') " +
            "ORDER BY createdAt DESC"
    )
    fun search(status: String?, query: String): Flow<List<ScanEntity>>

    @Update suspend fun update(entity: ScanEntity)

    @Query("DELETE FROM scan_entries WHERE id = :id") suspend fun deleteById(id: Long)

    @Query("DELETE FROM scan_entries") suspend fun deleteAll()
}
