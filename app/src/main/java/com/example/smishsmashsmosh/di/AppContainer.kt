package com.example.smishsmashsmosh.di

import android.content.Context
import com.example.smishsmashsmosh.data.device.AndroidHaptics
import com.example.smishsmashsmosh.data.device.SharedPrefsSettings
import com.example.smishsmashsmosh.domain.settings.SettingsRepository
import com.example.smishsmashsmosh.data.local.AppDatabase
import com.example.smishsmashsmosh.data.remote.NetworkModule
import com.example.smishsmashsmosh.data.repository.AnalysisRepository
import com.example.smishsmashsmosh.data.repository.AnalysisRepositoryImpl
import com.example.smishsmashsmosh.data.repository.ScanHistoryRepository
import com.example.smishsmashsmosh.data.repository.ScanHistoryRepositoryImpl
import com.example.smishsmashsmosh.domain.feedback.Haptics
import com.example.smishsmashsmosh.domain.usecase.AnalyzeAndSaveUseCase

/** Legare manuala a dependentelor, fara framework de DI. */
class AppContainer(context: Context) {
    val analysisRepository: AnalysisRepository = AnalysisRepositoryImpl(NetworkModule.analysisApi)
    val historyRepository: ScanHistoryRepository =
        ScanHistoryRepositoryImpl(AppDatabase.get(context).scanDao())
    val settings: SettingsRepository = SharedPrefsSettings(context)
    val haptics: Haptics = AndroidHaptics(context.applicationContext)
    val analyzeAndSave = AnalyzeAndSaveUseCase(analysisRepository, historyRepository)
}


