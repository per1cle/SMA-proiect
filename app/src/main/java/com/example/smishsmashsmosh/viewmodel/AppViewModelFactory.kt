package com.example.smishsmashsmosh.viewmodel

import android.app.Application
import androidx.lifecycle.ViewModelProvider.AndroidViewModelFactory.Companion.APPLICATION_KEY
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.smishsmashsmosh.di.AppContainer

val AppViewModelFactory = viewModelFactory {
    initializer {
        val c = AppContainer(this[APPLICATION_KEY] as Application)
        AnalysisViewModel(c.analyzeAndSave, c.haptics, c.settings)
    }
    initializer {
        val c = AppContainer(this[APPLICATION_KEY] as Application)
        HistoryViewModel(c.historyRepository)
    }
}


