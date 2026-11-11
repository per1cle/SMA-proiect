package com.example.smishsmashsmosh.domain.settings

import kotlinx.coroutines.flow.StateFlow

interface SettingsRepository {
    val vibrationEnabled: StateFlow<Boolean>
    fun setVibrationEnabled(enabled: Boolean)
}
