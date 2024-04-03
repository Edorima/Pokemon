package com.example.androidspoonacular

import kotlinx.serialization.Serializable

@Serializable
data class RootReponse(
    val results : Array<Result>,
    val offset : Int,
    val number : Int,
    val totalResults : Int
)