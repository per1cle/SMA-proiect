package com.example.smishsmashsmosh.data.remote

import com.example.smishsmashsmosh.data.remote.dto.AnalysisRequest
import com.example.smishsmashsmosh.data.remote.dto.AnalysisResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface AnalysisApi {
    @POST("v1/analyze")
    suspend fun analyze(@Body request: AnalysisRequest): AnalysisResponse
}
