package com.example.smishsmashsmosh.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.smishsmashsmosh.domain.feedback.Haptics
import com.example.smishsmashsmosh.domain.model.AnalysisInput
import com.example.smishsmashsmosh.domain.model.ScanEntry
import com.example.smishsmashsmosh.domain.settings.SettingsRepository
import com.example.smishsmashsmosh.domain.usecase.AnalyzeAndSaveUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface AnalysisUiState {
    data object Idle : AnalysisUiState
    data object Loading : AnalysisUiState
    data class Success(val entry: ScanEntry) : AnalysisUiState
    data class Error(val message: String) : AnalysisUiState
}

class AnalysisViewModel(
    private val analyzeAndSave: AnalyzeAndSaveUseCase,
    private val haptics: Haptics,
    private val settings: SettingsRepository
) : ViewModel() {

    private val _state = MutableStateFlow<AnalysisUiState>(AnalysisUiState.Idle)
    val state: StateFlow<AnalysisUiState> = _state.asStateFlow()

    fun analyze(input: AnalysisInput, saveText: Boolean = true) {
        _state.value = AnalysisUiState.Loading
        viewModelScope.launch {
            analyzeAndSave(input, saveText)
                .onSuccess {
                    _state.value = AnalysisUiState.Success(it)
                    if (settings.vibrationEnabled.value) haptics.signal(it.result.status)
                }
                .onFailure { _state.value = AnalysisUiState.Error(it.message ?: "Eroare necunoscuta") }
        }
    }

    val vibrationEnabled: StateFlow<Boolean> = settings.vibrationEnabled
    fun setVibration(enabled: Boolean) = settings.setVibrationEnabled(enabled)

    fun reset() { _state.value = AnalysisUiState.Idle }
}


