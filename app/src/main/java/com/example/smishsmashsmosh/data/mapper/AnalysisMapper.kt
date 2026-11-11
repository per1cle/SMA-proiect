package com.example.smishsmashsmosh.data.mapper

import com.example.smishsmashsmosh.data.remote.dto.AnalysisRequest
import com.example.smishsmashsmosh.data.remote.dto.AnalysisResponse
import com.example.smishsmashsmosh.data.remote.dto.HighlightDto
import com.example.smishsmashsmosh.data.remote.dto.ReasonDto
import com.example.smishsmashsmosh.domain.model.AnalysisInput
import com.example.smishsmashsmosh.domain.model.AnalysisResult
import com.example.smishsmashsmosh.domain.model.Reason
import com.example.smishsmashsmosh.domain.model.TextRange

fun AnalysisInput.toRequest() = AnalysisRequest(text, type, source, sender, subject, links, locale)

fun AnalysisResponse.toDomain() = AnalysisResult(
    status = status,
    riskScore = riskScore.coerceIn(0f, 1f),
    reasons = reasons.map { it.toDomain() },
    advice = advice,
    modelVersion = modelVersion
)

fun ReasonDto.toDomain() = Reason(code, message, highlight?.let { TextRange(it.start, it.end) })
fun Reason.toDto() = ReasonDto(code, message, highlight?.let { HighlightDto(it.start, it.end) })
