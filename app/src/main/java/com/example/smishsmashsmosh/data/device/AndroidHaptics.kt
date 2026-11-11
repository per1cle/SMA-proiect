package com.example.smishsmashsmosh.data.device

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import com.example.smishsmashsmosh.domain.feedback.Haptics
import com.example.smishsmashsmosh.domain.feedback.VibrationPatterns
import com.example.smishsmashsmosh.domain.model.Status

class AndroidHaptics(context: Context) : Haptics {
    private val vibrator: Vibrator? =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S)
            context.getSystemService(VibratorManager::class.java)?.defaultVibrator
        else
            @Suppress("DEPRECATION") context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator

    override fun signal(status: Status) {
        val v = vibrator ?: return
        if (!v.hasVibrator()) return
        val pattern = VibrationPatterns.forStatus(status) ?: return
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            v.vibrate(VibrationEffect.createWaveform(pattern, -1))
        } else {
            @Suppress("DEPRECATION") v.vibrate(pattern, -1)
        }
    }
}
