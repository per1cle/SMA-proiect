package com.example.smishsmashsmosh.data.repository

import com.example.smishsmashsmosh.data.mapper.toDomain
import com.example.smishsmashsmosh.data.mapper.toRequest
import com.example.smishsmashsmosh.data.remote.AnalysisApi
import com.example.smishsmashsmosh.domain.model.AnalysisError
import com.example.smishsmashsmosh.domain.model.AnalysisInput
import com.example.smishsmashsmosh.domain.model.AnalysisResult
import kotlinx.coroutines.CancellationException
import retrofit2.HttpException
import java.io.IOException

interface AnalysisRepository {
    suspend fun analyze(input: AnalysisInput): Result<AnalysisResult>
}

class AnalysisRepositoryImpl(private val api: AnalysisApi) : AnalysisRepository {
    override suspend fun analyze(input: AnalysisInput): Result<AnalysisResult> = try {
        Result.success(api.analyze(input.toRequest()).toDomain())
    } catch (e: CancellationException) {
        throw e
    } catch (e: IOException) {
        Result.failure(AnalysisError.Network())
    } catch (e: HttpException) {
        Result.failure(
            when (e.code()) {
                400 -> AnalysisError.BadRequest(e.message())
                413 -> AnalysisError.TooLarge()
                429 -> AnalysisError.RateLimited()
                in 500..599 -> AnalysisError.Server()
                else -> AnalysisError.Unknown(e.message())
            }
        )
    } catch (e: Exception) {
        Result.failure(AnalysisError.Unknown(e.message ?: "Eroare necunoscuta"))
    }
}
