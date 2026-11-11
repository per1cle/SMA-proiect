package com.example.smishsmashsmosh.data.mapper

import com.example.smishsmashsmosh.data.local.ScanEntity
import com.example.smishsmashsmosh.data.remote.dto.ReasonDto
import com.example.smishsmashsmosh.domain.model.AnalysisResult
import com.example.smishsmashsmosh.domain.model.MessageType
import com.example.smishsmashsmosh.domain.model.ScanEntry
import com.example.smishsmashsmosh.domain.model.ScanSource
import com.example.smishsmashsmosh.domain.model.Status
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.json.Json

private val json = Json { ignoreUnknownKeys = true }
private val reasonsSer = ListSerializer(ReasonDto.serializer())

fun ScanEntry.toEntity() = ScanEntity(
    id = id, text = text, type = type.name, source = source.name, sender = sender, subject = subject,
    status = result.status.name, riskScore = result.riskScore,
    reasonsJson = json.encodeToString(reasonsSer, result.reasons.map { it.toDto() }),
    advice = result.advice, modelVersion = result.modelVersion,
    note = note, reported = reported, falsePositive = falsePositive, createdAt = createdAt
)

fun ScanEntity.toDomain() = ScanEntry(
    id = id, text = text,
    type = runCatching { MessageType.valueOf(type) }.getOrDefault(MessageType.SMS),
    source = runCatching { ScanSource.valueOf(source) }.getOrDefault(ScanSource.PASTE),
    sender = sender, subject = subject,
    result = AnalysisResult(
        status = runCatching { Status.valueOf(status) }.getOrDefault(Status.UNKNOWN),
        riskScore = riskScore,
        reasons = runCatching { json.decodeFromString(reasonsSer, reasonsJson) }
            .getOrDefault(emptyList()).map { it.toDomain() },
        advice = advice, modelVersion = modelVersion
    ),
    note = note, reported = reported, falsePositive = falsePositive, createdAt = createdAt
)
