package com.example.androidspoonacular

import kotlinx.serialization.Serializable

@Serializable
data class RootReponse(
    val results : Array<Result>,
    val offset : Int,
    val number : Int,
    val totalResults : Int
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as RootReponse

        if (!results.contentEquals(other.results)) return false
        if (offset != other.offset) return false
        if (number != other.number) return false
        if (totalResults != other.totalResults) return false

        return true
    }

    override fun hashCode(): Int {
        var result = results.contentHashCode()
        result = 31 * result + offset
        result = 31 * result + number
        result = 31 * result + totalResults
        return result
    }
}