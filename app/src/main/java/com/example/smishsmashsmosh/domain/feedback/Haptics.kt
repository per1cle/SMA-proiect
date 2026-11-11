package com.example.smishsmashsmosh.domain.feedback

import com.example.smishsmashsmosh.domain.model.Status

/** Actuator: feedback fizic pentru verdict. */
interface Haptics {
    fun signal(status: Status)
}

/** Pattern-uri (pauza, vibratie, pauza, vibratie...) in ms. Mai lung inseamna mai periculos. */
object VibrationPatterns {
    fun forStatus(status: Status): LongArray? = when (status) {
        Status.SAFE -> longArrayOf(0, 100)
        Status.SUSPICIOUS -> longArrayOf(0, 250, 150, 250)
        Status.DANGER -> longArrayOf(0, 600, 150, 600, 150, 600)
        Status.UNKNOWN -> null
    }
}
