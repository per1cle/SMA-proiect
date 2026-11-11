package com.example.smishsmashsmosh.domain.usecase

import com.example.smishsmashsmosh.data.repository.AnalysisRepository
import com.example.smishsmashsmosh.data.repository.ScanHistoryRepository
import com.example.smishsmashsmosh.domain.model.AnalysisInput
import com.example.smishsmashsmosh.domain.model.ScanEntry

/** Analizeaza un mesaj si salveaza automat rezultatul in istoric. */
class AnalyzeAndSaveUseCase(
    private val analysis: AnalysisRepository,
    private val history: ScanHistoryRepository
) {
    suspend operator fun invoke(input: AnalysisInput, saveText: Boolean = true): Result<ScanEntry> =
        analysis.analyze(input).map { result ->
            val entry = ScanEntry(
                text = if (saveText) input.text else null,
                type = input.type,
                source = input.source,
                sender = input.sender,
                subject = input.subject,
                result = result
            )
            entry.copy(id = history.add(entry))
        }
}
