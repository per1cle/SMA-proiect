package com.example.smishsmashsmosh

import com.example.smishsmashsmosh.data.mapper.toDomain
import com.example.smishsmashsmosh.data.mapper.toEntity
import com.example.smishsmashsmosh.data.remote.MockAnalysisApi
import com.example.smishsmashsmosh.data.remote.dto.AnalysisRequest
import com.example.smishsmashsmosh.data.remote.dto.AnalysisResponse
import com.example.smishsmashsmosh.data.remote.dto.ReasonDto
import com.example.smishsmashsmosh.domain.model.*
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import com.example.smishsmashsmosh.domain.feedback.VibrationPatterns
import org.junit.Assert.assertTrue
import org.junit.Test

class ContractTests {
    @Test fun scanEntry_roundTripsThroughEntity() {
        val e = ScanEntry(
            id = 3, text = "salut", type = MessageType.EMAIL, source = ScanSource.SHARE,
            sender = "a@b.ro", subject = "s",
            result = AnalysisResult(
                Status.DANGER, 0.9f,
                listOf(Reason("LINK", "link", TextRange(1, 4))), "sterge", "v1"
            ),
            note = "n", reported = true, falsePositive = false, createdAt = 42
        )
        assertEquals(e, e.toEntity().toDomain())
    }

    @Test fun response_clampsRiskScore() {
        val r = AnalysisResponse(Status.SAFE, 5f, listOf(ReasonDto("X", "m")), "", "").toDomain()
        assertEquals(1f, r.riskScore, 0f)
    }

    @Test fun mock_flagsDangerousMessage() = runBlocking {
        val r = MockAnalysisApi().analyze(
            AnalysisRequest("URGENT: contul e blocat http://x.ro da codul", MessageType.SMS)
        )
        assertEquals(Status.DANGER, r.status)
    }

    @Test fun mock_safeMessage() = runBlocking {
        val r = MockAnalysisApi().analyze(AnalysisRequest("Ne vedem la 5", MessageType.SMS))
        assertEquals(Status.SAFE, r.status)
        assertNull(r.reasons.firstOrNull())
    }

    @Test fun vibration_dangerIsLongerThanSafe_unknownIsSilent() {
        val safe = VibrationPatterns.forStatus(Status.SAFE)!!.sum()
        val danger = VibrationPatterns.forStatus(Status.DANGER)!!.sum()
        assertTrue(danger > safe)
        assertNull(VibrationPatterns.forStatus(Status.UNKNOWN))
    }
}
