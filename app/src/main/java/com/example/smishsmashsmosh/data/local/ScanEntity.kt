package com.example.smishsmashsmosh.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "scan_entries")
data class ScanEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val text: String?,
    val type: String,
    val source: String,
    val sender: String?,
    val subject: String?,
    val status: String,
    val riskScore: Float,
    val reasonsJson: String,
    val advice: String,
    val modelVersion: String,
    val note: String,
    val reported: Boolean,
    val falsePositive: Boolean,
    val createdAt: Long
)
