package com.example.smishsmashsmosh.data.device

import android.content.Context
import com.example.smishsmashsmosh.domain.settings.SettingsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import androidx.core.content.edit

class SharedPrefsSettings(context: Context) : SettingsRepository {
    private val prefs = context.applicationContext.getSharedPreferences("settings", Context.MODE_PRIVATE)
    private val _vibration = MutableStateFlow(prefs.getBoolean(KEY_VIBRATION, true))
    override val vibrationEnabled: StateFlow<Boolean> = _vibration.asStateFlow()

    override fun setVibrationEnabled(enabled: Boolean) {
        prefs.edit { putBoolean(KEY_VIBRATION, enabled) }
        _vibration.value = enabled
    }

    private companion object { const val KEY_VIBRATION = "vibration_enabled" }
}
